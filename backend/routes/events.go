package routes

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/b-j-roberts/foc-fun/backend/internal/db"
	routeutils "github.com/b-j-roberts/foc-fun/backend/routes/utils"
)

func InitEventsRoutes() {
	http.HandleFunc("/events/get-latest", getLatestEvent)
	http.HandleFunc("/events/get-events", getEvents)
	http.HandleFunc("/events/get-events-from", getEventsFrom)
	http.HandleFunc("/events/get-latest-with", getLatestEventWith)
	http.HandleFunc("/events/get-events-ordered", getEventsOrdered)
	http.HandleFunc("/events/get-events-ordered-data", getEventsOrderedData)
	http.HandleFunc("/events/get-registered-events", getRegisteredEvents)

	http.HandleFunc("/events/get-latest-typed", getLatestEventTyped)

  http.HandleFunc("/events/get-events-mongo", getEventsMongo)
  http.HandleFunc("/events/get-events-mongo-with", getEventsMongoWith)
}

type Event struct {
	ID      int      `json:"id"`
	EventId int      `json:"event_id"`
	Keys    []string `json:"keys"`
	Data    []string `json:"data"`
}

func getLatestEvent(w http.ResponseWriter, r *http.Request) {
	eventIdStr := r.URL.Query().Get("eventId")
	if eventIdStr == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing eventId")
		return
	}
	eventId, err := strconv.Atoi(eventIdStr)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid eventId")
		return
	}

	query := "SELECT * FROM processedevents WHERE event_id=$1 ORDER BY id DESC LIMIT 1"
	event, err := db.PostgresQueryOneJson[Event](query, eventId)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error fetching latest event")
		return
	}

	routeutils.WriteDataJson(w, string(event))
}

type EventTypedInput struct {
	ID        int      `json:"id"`
	EventId   int      `json:"event_id"`
	Keys      []string `json:"keys"`
	Data      []string `json:"data"`
	ClassHash string   `json:"class_hash"`
}

func getLatestEventTyped(w http.ResponseWriter, r *http.Request) {
	eventIdStr := r.URL.Query().Get("eventId")
	if eventIdStr == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing eventId")
		return
	}
	eventId, err := strconv.Atoi(eventIdStr)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid eventId")
		return
	}

	query := "SELECT e.*, c.class_hash FROM ProcessedEvents e JOIN Events ev ON e.event_id = ev.id JOIN Contracts c ON ev.contract_address = c.address WHERE e.event_id=$1 ORDER BY e.id DESC LIMIT 1"
	event, err := db.PostgresQueryOne[EventTypedInput](query, eventId)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error fetching latest event")
		return
	}

	filename := "abis/0x" + event.ClassHash + ".json"
	if _, err := os.Stat(filename); err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Contract class does not exist")
		return
	}

	// TODO: Typename from eventid
	typeName := r.URL.Query().Get("type")
	if typeName == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Type not specified")
		return
	}

	file, err := os.Open(filename)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error opening contract class file")
		return
	}
	defer file.Close()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error reading contract class file")
		return
	}

	var contractClass ContractClass
	err = json.Unmarshal(fileBytes, &contractClass)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error unmarshalling contract class file")
		return
	}

	abi := contractClass.Abi
	eventData := event.Keys[1:]
	eventData = append(eventData, event.Data...)
	typeNameJson := StarknetTypeDataMin(typeName, abi, eventData)
	typeNameJsonBytes, err := json.Marshal(typeNameJson)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error marshalling typed event")
		return
	}

	routeutils.WriteDataJson(w, string(typeNameJsonBytes))
}

func getEvents(w http.ResponseWriter, r *http.Request) {
	eventIdStr := r.URL.Query().Get("eventId")
	if eventIdStr == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing eventId")
		return
	}
	eventId, err := strconv.Atoi(eventIdStr)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid eventId")
		return
	}

	pageLength, err := strconv.Atoi(r.URL.Query().Get("pageLength"))
	if err != nil || pageLength < 1 {
		pageLength = 10
	}
	if pageLength > 30 {
		pageLength = 30
	}
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	if err != nil || page < 1 {
		page = 1
	}
	offset := (page - 1) * pageLength

	query := "SELECT * FROM processedevents WHERE event_id=$1 ORDER BY id ASC LIMIT $2 OFFSET $3"
	events, err := db.PostgresQueryJson[Event](query, eventId, pageLength, offset)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error fetching events")
		return
	}

	routeutils.WriteDataJson(w, string(events))
}

func getEventsFrom(w http.ResponseWriter, r *http.Request) {
	eventIdStr := r.URL.Query().Get("eventId")
	if eventIdStr == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing eventId")
		return
	}
	eventId, err := strconv.Atoi(eventIdStr)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid eventId")
		return
	}

	cursor := r.URL.Query().Get("cursor")
	if cursor == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing cursor")
		return
	}
	cursorInt, err := strconv.Atoi(cursor)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid cursor")
		return
	}
	pageLength, err := strconv.Atoi(r.URL.Query().Get("pageLength"))
	if err != nil || pageLength < 1 {
		pageLength = 10
	}
	if pageLength > 30 {
		pageLength = 30
	}

	query := "SELECT * FROM processedevents WHERE event_id=$1 AND id > $2 ORDER BY id ASC LIMIT $3"
	events, err := db.PostgresQueryJson[Event](query, eventId, cursorInt, pageLength)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error fetching events")
		return
	}

	routeutils.WriteDataJson(w, string(events))
}

type KeysFilter struct {
	Idx int    `json:"idx"`
	Key string `json:"key"`
}

func getLatestEventWith(w http.ResponseWriter, r *http.Request) {
	// Get the latest event for a specific eventId and key
	eventIdStr := r.URL.Query().Get("eventId")
	if eventIdStr == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing eventId")
		return
	}
	eventId, err := strconv.Atoi(eventIdStr)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid eventId")
		return
	}

	// Get the keys to filter by
	keysFilterRaw := r.URL.Query()["keys"]
	if len(keysFilterRaw) == 0 {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing keys")
		return
	}
	// Convert keys to a slice of KeysFilter
	// keysFilterRaw is a slice of strings like <keyidx>:<keyvalue>,<keyidx>:<keyvalue>,...
	keysFilter := make([]KeysFilter, len(keysFilterRaw))
	for i, key := range keysFilterRaw {
		keyParts := strings.Split(key, ":")
		if len(keyParts) != 2 {
			routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid key format")
			return
		}
		idx, err := strconv.Atoi(keyParts[0])
		if err != nil {
			routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid key index")
			return
		}
		keysFilter[i] = KeysFilter{Idx: idx, Key: keyParts[1]}
	}

	query := "SELECT * FROM processedevents WHERE event_id=$1 AND ("
	for i := range keysFilter {
		if i > 0 {
			query += " AND "
		}
		query += "keys[$" + strconv.Itoa(i*2+2) + "] = $" + strconv.Itoa(i*2+3)
	}
	query += ") ORDER BY id DESC LIMIT 1"
	// Prepare the args for the query
	args := make([]interface{}, len(keysFilter)*2+1)
	args[0] = eventId
	for i, key := range keysFilter {
		args[i*2+1] = key.Idx
		args[i*2+2] = key.Key
	}
	// Execute the query
	event, err := db.PostgresQueryOneJson[Event](query, args...)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error fetching latest event")
		return
	}
	if event == nil {
		routeutils.WriteErrorJson(w, http.StatusNotFound, "No event found for the given keys")
		return
	}
	routeutils.WriteDataJson(w, string(event))
}

func getEventsOrdered(w http.ResponseWriter, r *http.Request) {
	// Order events by a specific key
	eventIdStr := r.URL.Query().Get("eventId")
	if eventIdStr == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing eventId")
		return
	}
	eventId, err := strconv.Atoi(eventIdStr)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid eventId")
		return
	}

	keyIdxStr := r.URL.Query().Get("keyIdx")
	if keyIdxStr == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing keyIdx")
		return
	}
	keyIdx, err := strconv.Atoi(keyIdxStr)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid keyIdx")
		return
	}

	order := r.URL.Query().Get("order")
	if order != "asc" && order != "desc" {
		order = "asc"
	}
	pageLength, err := strconv.Atoi(r.URL.Query().Get("pageLength"))
	if err != nil || pageLength < 1 {
		pageLength = 10
	}
	if pageLength > 30 {
		pageLength = 30
	}
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	if err != nil || page < 1 {
		page = 1
	}
	offset := (page - 1) * pageLength
	orderBy := "keys[$1] " + order

	query := "SELECT * FROM processedevents WHERE event_id=$2 ORDER BY " + orderBy + " LIMIT $3 OFFSET $4"
	events, err := db.PostgresQueryJson[Event](query, keyIdx, eventId, pageLength, offset)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error fetching events")
		return
	}
	if events == nil {
		routeutils.WriteErrorJson(w, http.StatusNotFound, "No events found for the given eventId")
		return
	}
	routeutils.WriteDataJson(w, string(events))
}

func getEventsOrderedData(w http.ResponseWriter, r *http.Request) {
	// Order events by a specific data value with a unique key
	eventIdStr := r.URL.Query().Get("eventId")
	if eventIdStr == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing eventId")
		return
	}
	eventId, err := strconv.Atoi(eventIdStr)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid eventId")
		return
	}
	dataIdxStr := r.URL.Query().Get("dataIdx")
	if dataIdxStr == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing dataIdx")
		return
	}
	dataIdx, err := strconv.Atoi(dataIdxStr)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid dataIdx")
		return
	}

	order := r.URL.Query().Get("order")
	if order != "asc" && order != "desc" {
		order = "asc"
	}
	pageLength, err := strconv.Atoi(r.URL.Query().Get("pageLength"))
	if err != nil || pageLength < 1 {
		pageLength = 10
	}
	if pageLength > 30 {
		pageLength = 30
	}
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	if err != nil || page < 1 {
		page = 1
	}
	offset := (page - 1) * pageLength

	uniqueKeyIdx := r.URL.Query().Get("uniqueKey")
	useUniqueKey := false
	if uniqueKeyIdx != "" {
		useUniqueKey = true
	}

	var query string
	if useUniqueKey {
		query = "SELECT DISTINCT ON (keys[$1]) * FROM processedevents WHERE event_id=$2 ORDER BY data[$3] " + order + ", keys[$1] LIMIT $4 OFFSET $5"
		events, err := db.PostgresQueryJson[Event](query, uniqueKeyIdx, eventId, dataIdx, pageLength, offset)
		if err != nil {
			routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error fetching events")
			return
		}
		if events == nil {
			routeutils.WriteErrorJson(w, http.StatusNotFound, "No events found for the given eventId")
			return
		}
		routeutils.WriteDataJson(w, string(events))
	} else {
		query = "SELECT * FROM processedevents WHERE event_id=$2 ORDER BY data[$3] " + order + " LIMIT $4 OFFSET $5"
		events, err := db.PostgresQueryJson[Event](query, eventId, dataIdx, pageLength, offset)
		if err != nil {
			routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error fetching events")
			return
		}
		if events == nil {
			routeutils.WriteErrorJson(w, http.StatusNotFound, "No events found for the given eventId")
			return
		}
		routeutils.WriteDataJson(w, string(events))
	}
}

type RegisteredEvent struct {
	EventId         int    `json:"event_id"`
	ContractAddress string `json:"contract_address"`
	Selector        string `json:"selector"`
}

func getRegisteredEvents(w http.ResponseWriter, r *http.Request) {
	pageLength, err := strconv.Atoi(r.URL.Query().Get("pageLength"))
	if err != nil || pageLength < 1 {
		pageLength = 10
	}
	if pageLength > 30 {
		pageLength = 30
	}
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	if err != nil || page < 1 {
		page = 1
	}
	offset := (page - 1) * pageLength

	query := "SELECT * FROM RegisteredEvents LIMIT $1 OFFSET $2"
	events, err := db.PostgresQueryJson[RegisteredEvent](query, pageLength, offset)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error fetching events")
		return
	}
	if events == nil {
		routeutils.WriteErrorJson(w, http.StatusNotFound, "No events found")
		return
	}
	routeutils.WriteDataJson(w, string(events))
}

func getEventsMongo(w http.ResponseWriter, r *http.Request) {
  eventId := r.URL.Query().Get("eventId")
  if eventId == "" {
    routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing eventId")
    return
  }
  eventIdInt, err := strconv.Atoi(eventId)
  if err != nil {
    routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid eventId")
    return
  }

  res, err := db.GetFocFunEventsCollection().Find(r.Context(), map[string]interface{}{
    "event_id": eventIdInt,
  })
  if err != nil {
    routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error fetching events")
    return
  }
  defer res.Close(r.Context())
  var events []map[string]interface{}
  for res.Next(r.Context()) {
    var event map[string]interface{}
    if err := res.Decode(&event); err != nil {
      routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error decoding event")
      return
    }
    events = append(events, event)
  }
  if err := res.Err(); err != nil {
    routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error fetching events")
    return
  }
  if len(events) == 0 {
    routeutils.WriteErrorJson(w, http.StatusNotFound, "No events found")
    return
  }

  // Convert events to JSON
  eventsJson, err := json.Marshal(events)
  if err != nil {
    routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error marshalling events")
    return
  }
  // Write the JSON response
  routeutils.WriteDataJson(w, string(eventsJson))
}

type MongoFilter struct {
  Name  string `json:"name"`
  Value interface{} `json:"value"`
}
func getEventsMongoWith(w http.ResponseWriter, r *http.Request) {
  // Get the latest event for a specific eventId and key
  eventIdStr := r.URL.Query().Get("eventId")
  if eventIdStr == "" {
    routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing eventId")
    return
  }
  eventId, err := strconv.Atoi(eventIdStr)
  if err != nil {
    routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid eventId")
    return
  }

  // Get all other query params as keyFilters
  keysFilterRaw := r.URL.Query()
  keysFilter := make([]MongoFilter, 0)
  for key, values := range keysFilterRaw {
    if key == "eventId" {
      continue
    }
    for _, value := range values {
      valueInt, err := strconv.Atoi(value)
      if err != nil {
        routeutils.WriteErrorJson(w, http.StatusBadRequest, "Invalid value for key "+key)
        return
      }
      keysFilter = append(keysFilter, MongoFilter{Name: key, Value: valueInt})
    }
  }
  if len(keysFilter) == 0 {
    routeutils.WriteErrorJson(w, http.StatusBadRequest, "Missing keys")
    return
  }

  filter := map[string]interface{}{
    "event_id": eventId,
  }
  for _, key := range keysFilter {
    filter[key.Name] = key.Value
  }

  res, err := db.GetFocFunEventsCollection().Find(r.Context(), filter)
  if err != nil {
    routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error fetching events")
    return
  }
  defer res.Close(r.Context())
  var events []map[string]interface{}
  for res.Next(r.Context()) {
    var event map[string]interface{}
    if err := res.Decode(&event); err != nil {
      routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error decoding event")
      return
    }
    events = append(events, event)
  }
  if err := res.Err(); err != nil {
    routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error fetching events")
    return
  }
  if len(events) == 0 {
    routeutils.WriteErrorJson(w, http.StatusNotFound, "No events found")
    return
  }
  // Convert events to JSON
  eventsJson, err := json.Marshal(events)
  if err != nil {
    routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error marshalling events")
    return
  }
  // Write the JSON response
  routeutils.WriteDataJson(w, string(eventsJson))
}
