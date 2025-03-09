package indexer

import (
	"context"
	"strconv"

	"github.com/b-j-roberts/foc-fun/backend/internal/db"
)

func processClassRegisteredEvent(event IndexerEventWithTransaction) {
	classHashHex := event.Event.Keys[1][2:] // remove 0x prefix
	classNameHex := event.Event.Data[0]
	classVersionHex := event.Event.Data[1]

	className, err := readFeltString(classNameHex)
	if err != nil {
		PrintIndexerEventError("processClassRegisteredEvent", event, err)
		return
	}

	classVersion, err := readFeltString(classVersionHex)
	if err != nil {
		PrintIndexerEventError("processClassRegisteredEvent", event, err)
		return
	}

	_, err = db.Db.Postgres.Exec(context.Background(), "INSERT INTO classes (hash, name, version) VALUES ($1, $2, $3)", classHashHex, className, classVersion)
	if err != nil {
		PrintIndexerEventError("processClassRegisteredEvent", event, err)
		return
	}

	_, err = db.Db.Postgres.Exec(context.Background(), "INSERT INTO registeredclasses (hash) VALUES ($1)", classHashHex)
	if err != nil {
		PrintIndexerEventError("processClassRegisteredEvent", event, err)
		return
	}
}

func revertClassRegisteredEvent(event IndexerEventWithTransaction) {
	classHashHex := event.Event.Keys[1][2:] // remove 0x prefix

	_, err := db.Db.Postgres.Exec(context.Background(), "DELETE FROM classes WHERE hash = $1", classHashHex)
	if err != nil {
		PrintIndexerEventError("revertClassRegisteredEvent", event, err)
		return
	}

	_, err = db.Db.Postgres.Exec(context.Background(), "DELETE FROM registeredclasses WHERE hash = $1", classHashHex)
	if err != nil {
		PrintIndexerEventError("revertClassRegisteredEvent", event, err)
		return
	}
}

func processClassUnregisteredEvent(event IndexerEventWithTransaction) {
	classHashHex := event.Event.Keys[1][2:] // remove 0x prefix

	_, err := db.Db.Postgres.Exec(context.Background(), "DELETE FROM registeredclasses WHERE hash = $1", classHashHex)
	if err != nil {
		PrintIndexerEventError("processClassUnregisteredEvent", event, err)
		return
	}
}

func revertClassUnregisteredEvent(event IndexerEventWithTransaction) {
	classHashHex := event.Event.Keys[1][2:] // remove 0x prefix

	_, err := db.Db.Postgres.Exec(context.Background(), "INSERT INTO registeredclasses (hash) VALUES ($1)", classHashHex)
	if err != nil {
		PrintIndexerEventError("revertClassUnregisteredEvent", event, err)
		return
	}
}

func processContractRegisteredEvent(event IndexerEventWithTransaction) {
	contractAddressHex := event.Event.Keys[1][2:]   // remove 0x prefix
	contractClassHashHex := event.Event.Data[0][2:] // remove 0x prefix

	_, err := db.Db.Postgres.Exec(context.Background(), "INSERT INTO contracts (address, class_hash) VALUES ($1, $2)", contractAddressHex, contractClassHashHex)
	if err != nil {
		PrintIndexerEventError("processContractRegisteredEvent", event, err)
		return
	}

	_, err = db.Db.Postgres.Exec(context.Background(), "INSERT INTO registeredcontracts (address) VALUES ($1)", contractAddressHex)
	if err != nil {
		PrintIndexerEventError("processContractRegisteredEvent", event, err)
		return
	}
}

func revertContractRegisteredEvent(event IndexerEventWithTransaction) {
	contractAddressHex := event.Event.Keys[1][2:] // remove 0x prefix

	_, err := db.Db.Postgres.Exec(context.Background(), "DELETE FROM contracts WHERE address = $1", contractAddressHex)
	if err != nil {
		PrintIndexerEventError("revertContractRegisteredEvent", event, err)
		return
	}

	_, err = db.Db.Postgres.Exec(context.Background(), "DELETE FROM registeredcontracts WHERE address = $1", contractAddressHex)
	if err != nil {
		PrintIndexerEventError("revertContractRegisteredEvent", event, err)
		return
	}
}

func processContractUnregisteredEvent(event IndexerEventWithTransaction) {
	contractAddressHex := event.Event.Keys[1][2:] // remove 0x prefix

	_, err := db.Db.Postgres.Exec(context.Background(), "DELETE FROM registeredcontracts WHERE address = $1", contractAddressHex)
	if err != nil {
		PrintIndexerEventError("processContractUnregisteredEvent", event, err)
		return
	}
}

func revertContractUnregisteredEvent(event IndexerEventWithTransaction) {
	contractAddressHex := event.Event.Keys[1][2:] // remove 0x prefix

	_, err := db.Db.Postgres.Exec(context.Background(), "INSERT INTO registeredcontracts (address) VALUES ($1)", contractAddressHex)
	if err != nil {
		PrintIndexerEventError("revertContractUnregisteredEvent", event, err)
		return
	}
}

func processEventRegisteredEvent(event IndexerEventWithTransaction) {
	eventIdHex := event.Event.Keys[1]
	contractAddressHex := event.Event.Data[0][2:] // remove 0x prefix
	eventSelectorHex := event.Event.Data[1][2:]   // remove 0x prefix

	eventId, err := strconv.ParseInt(eventIdHex, 0, 64)
	if err != nil {
		PrintIndexerEventError("processEventRegisteredEvent", event, err)
		return
	}

	_, err = db.Db.Postgres.Exec(context.Background(), "INSERT INTO events (id, contract_address, selector) VALUES ($1, $2, $3)", eventId, contractAddressHex, eventSelectorHex)
	if err != nil {
		PrintIndexerEventError("processEventRegisteredEvent", event, err)
		return
	}

	_, err = db.Db.Postgres.Exec(context.Background(), "INSERT INTO registeredevents (id) VALUES ($1)", eventId)
	if err != nil {
		PrintIndexerEventError("processEventRegisteredEvent", event, err)
		return
	}
}

func revertEventRegisteredEvent(event IndexerEventWithTransaction) {
	eventIdHex := event.Event.Keys[1]

	_, err := db.Db.Postgres.Exec(context.Background(), "DELETE FROM events WHERE id = $1", eventIdHex)
	if err != nil {
		PrintIndexerEventError("revertEventRegisteredEvent", event, err)
		return
	}

	_, err = db.Db.Postgres.Exec(context.Background(), "DELETE FROM registeredevents WHERE id = $1", eventIdHex)
	if err != nil {
		PrintIndexerEventError("revertEventRegisteredEvent", event, err)
		return
	}
}

func processEventUnregisteredEvent(event IndexerEventWithTransaction) {
	eventIdHex := event.Event.Keys[1]

	_, err := db.Db.Postgres.Exec(context.Background(), "DELETE FROM registeredevents WHERE id = $1", eventIdHex)
	if err != nil {
		PrintIndexerEventError("processEventUnregisteredEvent", event, err)
		return
	}
}

func revertEventUnregisteredEvent(event IndexerEventWithTransaction) {
	eventIdHex := event.Event.Keys[1]

	_, err := db.Db.Postgres.Exec(context.Background(), "INSERT INTO registeredevents (id) VALUES ($1)", eventIdHex)
	if err != nil {
		PrintIndexerEventError("revertEventUnregisteredEvent", event, err)
		return
	}
}
