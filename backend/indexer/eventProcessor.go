package indexer

import (
	"context"
	"encoding/json"
	"io"
	"os"

	"github.com/b-j-roberts/foc-fun/backend/internal/db"
	"github.com/b-j-roberts/foc-fun/backend/routes"
)

func processEvent(eventId int, event IndexerEventWithTransaction) {
	keys := event.Event.Keys
	data := event.Event.Data

	_, err := db.Db.Postgres.Exec(context.Background(), "INSERT INTO ProcessedEvents (event_id, keys, data) values ($1, $2, $3)", eventId, keys, data)
	if err != nil {
		PrintIndexerEventError("processEventRegisteredEvent", event, err)
		return
	}

  eventType := RegistedEvents[eventId]

	filename := "abis/" + eventType.ClassHash + ".json"
	if _, err := os.Stat(filename); err != nil {
    PrintIndexerEventError("processEventRegisteredEvent", event, err)
		return
	}

	// TODO: Typename from eventid
	typeName := "ValueChanged"
	if typeName == "" {
    PrintIndexerEventError("processEventRegisteredEvent", event, err)
		return
	}

	file, err := os.Open(filename)
	if err != nil {
    PrintIndexerEventError("processEventRegisteredEvent", event, err)
		return
	}
	defer file.Close()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
    PrintIndexerEventError("processEventRegisteredEvent", event, err)
		return
	}

	var contractClass routes.ContractClass
	err = json.Unmarshal(fileBytes, &contractClass)
	if err != nil {
    PrintIndexerEventError("processEventRegisteredEvent", event, err)
		return
	}

	abi := contractClass.Abi
  eventData := keys[1:]
	eventData = append(eventData, data...)
  typeNameJson := routes.StarknetTypeDataMin(typeName, abi, eventData)
  typeNameJson.(map[string]interface{})["event_id"] = eventId

  /*
  _, err = db.MongoInsertEvent(eventId, keys, data)
  if err != nil {
    PrintIndexerEventError("processEventRegisteredEvent Mongo", event, err)
    return
  }
  */

  _, err = db.MongoInsertJson(typeNameJson)
  if err != nil {
    PrintIndexerEventError("processEventRegisteredEvent Mongo", event, err)
    return
  }
}

func revertProcessEvent(eventId int, event IndexerEventWithTransaction) {
	// Delete the last processed event from the database
	_, err := db.Db.Postgres.Exec(context.Background(), "DELETE FROM ProcessedEvents WHERE event_id = $1 ORDER BY id DESC LIMIT 1", eventId)
	if err != nil {
		PrintIndexerEventError("revertProcessEvent", event, err)
		return
	}

  // Delete the last processed event from MongoDB
  _, err = db.MongoDeleteEvent(eventId)
  if err != nil {
    PrintIndexerEventError("revertProcessEvent Mongo", event, err)
    return
  }
}
