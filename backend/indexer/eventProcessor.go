package indexer

import (
	"context"

	"github.com/b-j-roberts/foc-fun/backend/internal/db"
)

func processEvent(eventId int, event IndexerEventWithTransaction) {
	keys := event.Event.Keys
	data := event.Event.Data

	_, err := db.Db.Postgres.Exec(context.Background(), "INSERT INTO ProcessedEvents (event_id, keys, data) values ($1, $2, $3)", eventId, keys, data)
	if err != nil {
		PrintIndexerEventError("processEventRegisteredEvent", event, err)
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
}
