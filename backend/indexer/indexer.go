package indexer

import (
	"fmt"
	"net/http"
	"sync"

	routeutils "github.com/b-j-roberts/foc-fun/backend/routes/utils"
)

// TODO: Implement changes from art/peace round 3
func InitIndexerRoutes() {
	http.HandleFunc("/consume-indexer-msg", consumeIndexerMsg)
}

type IndexerTransaction struct {
	Meta     IndexerTransactionMeta `json:"meta"`
	InvokeV0 IndexerInvokeV0        `json:"invokeV0"`
	InvokeV1 IndexerInvokeV1        `json:"invokeV1"`
	InvokeV3 IndexerInvokeV3        `json:"invokeV3"`
}

type IndexerTransactionMeta struct {
	Meta struct {
		Hash             string `json:"hash"`
		MaxFee           string `json:"maxFee"`
		Nonce            string `json:"nonce"`
		Version          string `json:"version"`
		TransactionIndex string `json:"transactionIndex"`
	}
}

type IndexerInvokeV0 struct {
	MaxFee             string   `json:"maxFee"`
	ContractAddress    string   `json:"contractAddress"`
	EntryPointSelector string   `json:"entryPointSelector"`
	Calldata           []string `json:"calldata"`
}

type IndexerInvokeV1 struct {
	SenderAddress string   `json:"senderAddress"`
	Calldata      []string `json:"calldata"`
	MaxFee        string   `json:"maxFee"`
	Nonce         string   `json:"nonce"`
}

type IndexerInvokeV3 struct {
	SenderAddress string   `json:"senderAddress"`
	Calldata      []string `json:"calldata"`
	Nonce         string   `json:"nonce"`
}

type IndexerCursor struct {
	OrderKey  int    `json:"orderKey"`
	UniqueKey string `json:"uniqueKey"`
}

type IndexerEventWithTransaction struct {
	Event struct {
		FromAddress string   `json:"fromAddress"`
		Keys        []string `json:"keys"`
		Data        []string `json:"data"`
	} `json:"event"`
	Transaction IndexerTransaction `json:"transaction"`
}

type IndexerMessage struct {
	Data struct {
		Cursor    IndexerCursor `json:"cursor"`
		EndCursor IndexerCursor `json:"end_cursor"`
		Finality  string        `json:"finality"`
		Batch     []struct {
			Status string                        `json:"status"`
			Events []IndexerEventWithTransaction `json:"events"`
		} `json:"batch"`
	} `json:"data"`
}

var LatestPendingMessage *IndexerMessage
var LastProcessedPendingMessage *IndexerMessage
var PendingMessageLock = &sync.Mutex{}
var LastAcceptedEndKey int
var AcceptedMessageQueue []IndexerMessage
var AcceptedMessageLock = &sync.Mutex{}
var LastFinalizedCursor int
var FinalizedMessageQueue []IndexerMessage
var FinalizedMessageLock = &sync.Mutex{}

const (
	classRegisteredEvent      = "0x011fcf2735cfadde3c48253da6e8eacdf6030dc3694cc3d710b22214d6a2ed19"
	classUnregisteredEvent    = "0x02d1c04b30a8b94c8c50041b1ed30cb6ffc4262fad157e3667bbf079fd98573e"
	contractRegisteredEvent   = "0x0206ba27d5bbda42a63e108ee1ac7a6455c197ee34cd40a268e61b06f78dbc9a"
	contractUnregisteredEvent = "0x0069e43076bf9eba962d5d3f8b222b4cdfcfe683bb250721b723e260180c10a9"
	eventRegisteredEvent      = "0x00b76210508ae32b1edabae03977822391fd60465414b2ddbdafbebd1f0240f8"
	eventUnregisteredEvent    = "0x011623d02d5b80848a6a356e327cf4904e3b610faaf26f7e1d38c31cfd180632"
)

type RegisteredEvent struct {
	Id              int
	ContractAddress string
	EventSelector   string
}

var RegistedEvents = []RegisteredEvent{}

func RegisterEventMemory(id int, contractAddress string, eventSelector string) {
	RegistedEvents = append(RegistedEvents, RegisteredEvent{
		Id:              id,
		ContractAddress: "0x" + contractAddress,
		EventSelector:   "0x" + eventSelector,
	})
}

// TODO: Use map instead of slice for faster lookups
func UnregisterEventMemory(id int, contractAddress string, eventSelector string) {
	for idx, regEvent := range RegistedEvents {
		if regEvent.Id == id && regEvent.ContractAddress == "0x"+contractAddress && regEvent.EventSelector == "0x"+eventSelector {
			RegistedEvents = append(RegistedEvents[:idx], RegistedEvents[idx+1:]...)
			break
		}
	}
}

var eventProcessors = map[string](func(IndexerEventWithTransaction)){
	classRegisteredEvent:      processClassRegisteredEvent,
	classUnregisteredEvent:    processClassUnregisteredEvent,
	contractRegisteredEvent:   processContractRegisteredEvent,
	contractUnregisteredEvent: processContractUnregisteredEvent,
	eventRegisteredEvent:      processEventRegisteredEvent,
	eventUnregisteredEvent:    processEventUnregisteredEvent,
}

var eventReverters = map[string](func(IndexerEventWithTransaction)){
	classRegisteredEvent:      revertClassRegisteredEvent,
	classUnregisteredEvent:    revertClassUnregisteredEvent,
	contractRegisteredEvent:   revertContractRegisteredEvent,
	contractUnregisteredEvent: revertContractUnregisteredEvent,
	eventRegisteredEvent:      revertEventRegisteredEvent,
	eventUnregisteredEvent:    revertEventUnregisteredEvent,
}

var eventRequiresOrdering = map[string]bool{
	classRegisteredEvent:      true,
	classUnregisteredEvent:    true,
	contractRegisteredEvent:   true,
	contractUnregisteredEvent: true,
	eventRegisteredEvent:      true,
	eventUnregisteredEvent:    true,
}

const (
	DATA_STATUS_FINALIZED = "DATA_STATUS_FINALIZED"
	DATA_STATUS_ACCEPTED  = "DATA_STATUS_ACCEPTED"
	DATA_STATUS_PENDING   = "DATA_STATUS_PENDING"
)

func PrintIndexerEventError(funcName string, event IndexerEventWithTransaction, err error) {
	fmt.Println("Error in", funcName, " error: ( ", err, " ) from event: ")
	fmt.Println("    ", event.Event.FromAddress)
	fmt.Println("    Keys:")
	for _, key := range event.Event.Keys {
		fmt.Println("        ", key)
	}
	fmt.Println("    Data:")
	for _, data := range event.Event.Data {
		fmt.Println("        ", data)
	}
	fmt.Println("    CallData:")
	if event.Transaction.InvokeV0.Calldata != nil {
		for _, calldata := range event.Transaction.InvokeV0.Calldata {
			fmt.Println("        ", calldata)
		}
	} else if event.Transaction.InvokeV1.Calldata != nil {
		for _, calldata := range event.Transaction.InvokeV1.Calldata {
			fmt.Println("        ", calldata)
		}
	} else if event.Transaction.InvokeV3.Calldata != nil {
		for _, calldata := range event.Transaction.InvokeV3.Calldata {
			fmt.Println("        ", calldata)
		}
	}
}

func PrintIndexerError(funcName string, err string, data interface{}) {
	fmt.Println("Error in", funcName, " error: ( ", err, " ) from data: ")
	fmt.Println("    ", data)
}

func consumeIndexerMsg(w http.ResponseWriter, r *http.Request) {
	message, err := routeutils.ReadJsonBody[IndexerMessage](r)
	if err != nil {
		PrintIndexerError("consumeIndexerMsg", "error reading indexer message", err)
		return
	}

	if len(message.Data.Batch) == 0 {
		fmt.Println("No events in batch")
		return
	}

	if message.Data.Finality == DATA_STATUS_FINALIZED {
		FinalizedMessageLock.Lock()
		FinalizedMessageQueue = append(FinalizedMessageQueue, *message)
		FinalizedMessageLock.Unlock()
		return
	} else if message.Data.Finality == DATA_STATUS_ACCEPTED {
		AcceptedMessageLock.Lock()
		AcceptedMessageQueue = append(AcceptedMessageQueue, *message)
		AcceptedMessageLock.Unlock()
		return
	} else if message.Data.Finality == DATA_STATUS_PENDING {
		PendingMessageLock.Lock()
		LatestPendingMessage = message
		PendingMessageLock.Unlock()
		return
	} else {
		fmt.Println("Unknown finality status")
	}
}

func ProcessMessageEvents(message IndexerMessage) {
	for _, event := range message.Data.Batch[0].Events {
		eventKey := event.Event.Keys[0]
		eventProcessor, ok := eventProcessors[eventKey]
		if ok {
			eventProcessor(event)
		}

		for _, regEvent := range RegistedEvents {
			if regEvent.ContractAddress == event.Event.FromAddress && regEvent.EventSelector == eventKey {
				processEvent(regEvent.Id, event)
			}
		}
	}
}

func EventComparator(event1 IndexerEventWithTransaction, event2 IndexerEventWithTransaction) bool {
	if event1.Event.FromAddress != event2.Event.FromAddress {
		return false
	}

	if len(event1.Event.Keys) != len(event2.Event.Keys) {
		return false
	}

	if len(event1.Event.Data) != len(event2.Event.Data) {
		return false
	}

	for idx := 0; idx < len(event1.Event.Keys); idx++ {
		if event1.Event.Keys[idx] != event2.Event.Keys[idx] {
			return false
		}
	}

	for idx := 0; idx < len(event1.Event.Data); idx++ {
		if event1.Event.Data[idx] != event2.Event.Data[idx] {
			return false
		}
	}

	return true
}

func processMessageEventsWithReverter(oldMessage IndexerMessage, newMessage IndexerMessage) {
	var idx int
	var latestEventIndex int
	var unorderedEvents []IndexerEventWithTransaction
	for idx = 0; idx < len(oldMessage.Data.Batch[0].Events); idx++ {
		oldEvent := oldMessage.Data.Batch[0].Events[idx]
		newEvent := newMessage.Data.Batch[0].Events[idx]
		// Check if events are the same
		if EventComparator(oldEvent, newEvent) {
			latestEventIndex = idx
			continue
		}

		// Non-matching events, revert remaining old events based on ordering
		// Revert events from end of old events to current event
		latestEventIndex = idx
		for idx = len(oldMessage.Data.Batch[0].Events) - 1; idx >= latestEventIndex; idx-- {
			eventKey := oldMessage.Data.Batch[0].Events[idx].Event.Keys[0]
			if eventRequiresOrdering[eventKey] {
				// Revert event
				eventReverter, ok := eventReverters[eventKey]
				if ok {
					eventReverter(oldMessage.Data.Batch[0].Events[idx])
				}

				for _, regEvent := range RegistedEvents {
					if regEvent.ContractAddress == oldMessage.Data.Batch[0].Events[idx].Event.FromAddress && regEvent.EventSelector == eventKey {
						revertProcessEvent(regEvent.Id, oldMessage.Data.Batch[0].Events[idx])
					}
				}
			} else {
				unorderedEvents = append(unorderedEvents, oldMessage.Data.Batch[0].Events[idx])
			}
		}
		break
	}

	// Process new events
	for idx = latestEventIndex + 1; idx < len(newMessage.Data.Batch[0].Events); idx++ {
		eventKey := newMessage.Data.Batch[0].Events[idx].Event.Keys[0]

		// Check if event is in unordered events
		var wasProcessed bool
		for idx, unorderedEvent := range unorderedEvents {
			if EventComparator(unorderedEvent, newMessage.Data.Batch[0].Events[idx]) {
				// Remove event from unordered events
				unorderedEvents = append(unorderedEvents[:idx], unorderedEvents[idx+1:]...)
				wasProcessed = true
				break
			}
		}
		if wasProcessed {
			continue
		}

		eventProcessor, ok := eventProcessors[eventKey]
		if ok {
			eventProcessor(newMessage.Data.Batch[0].Events[idx])
		}

		for _, regEvent := range RegistedEvents {
			if regEvent.ContractAddress == newMessage.Data.Batch[0].Events[idx].Event.FromAddress && regEvent.EventSelector == eventKey {
				processEvent(regEvent.Id, newMessage.Data.Batch[0].Events[idx])
			}
		}
	}

	// Revert remaining unordered events
	for _, unorderedEvent := range unorderedEvents {
		eventKey := unorderedEvent.Event.Keys[0]
		eventReverter, ok := eventReverters[eventKey]
		if ok {
			eventReverter(unorderedEvent)
		}

		for _, regEvent := range RegistedEvents {
			if regEvent.ContractAddress == unorderedEvent.Event.FromAddress && regEvent.EventSelector == eventKey {
				revertProcessEvent(regEvent.Id, unorderedEvent)
			}
		}
	}
}

func ProcessMessage(message IndexerMessage) {
	// Check if there are pending messages for this start key
	// TODO: OrderKey or UniqueKey or both?
	if LastProcessedPendingMessage != nil && LastProcessedPendingMessage.Data.Cursor.OrderKey == message.Data.Cursor.OrderKey {
		processMessageEventsWithReverter(*LastProcessedPendingMessage, message)
	} else {
		ProcessMessageEvents(message)
	}
}

func TryProcessFinalizedMessages() bool {
	FinalizedMessageLock.Lock()
	defer FinalizedMessageLock.Unlock()

	if len(FinalizedMessageQueue) > 0 {
		message := FinalizedMessageQueue[0]
		FinalizedMessageQueue = FinalizedMessageQueue[1:]
		if message.Data.Cursor.OrderKey <= LastFinalizedCursor {
			// Skip message
			return true
		}
		ProcessMessage(message)
		LastFinalizedCursor = message.Data.Cursor.OrderKey
		return true
	}
	return false
}

func TryProcessAcceptedMessages() bool {
	AcceptedMessageLock.Lock()
	defer AcceptedMessageLock.Unlock()

	if len(AcceptedMessageQueue) > 0 {
		message := AcceptedMessageQueue[0]
		AcceptedMessageQueue = AcceptedMessageQueue[1:]
		// TODO: Check if message is already processed?
		ProcessMessage(message)
		// TODO
		LastFinalizedCursor = message.Data.Cursor.OrderKey
		return true
	}
	return false
}

func TryProcessPendingMessage() bool {
	PendingMessageLock.Lock()
	defer PendingMessageLock.Unlock()

	if LatestPendingMessage == nil {
		return false
	}

	ProcessMessage(*LatestPendingMessage)
	LastProcessedPendingMessage = LatestPendingMessage
	LatestPendingMessage = nil
	return true
}

func StartMessageProcessor() {
	// TODO: Init RegistedEvents from DB
	// Goroutine to process pending/accepted messages
	go func() {
		for {
			// Check Finalized messages ( for initial load )
			if TryProcessFinalizedMessages() {
				continue
			}

			// Prioritize accepted messages
			if TryProcessAcceptedMessages() {
				continue
			}

			if TryProcessPendingMessage() {
				continue
			}
		}
	}()
}

// TODO: User might miss some messages between loading canvas and connecting to websocket?
// TODO: Check thread safety of these things
