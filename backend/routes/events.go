package routes

import (
	"net/http"
	"strconv"

	"github.com/b-j-roberts/foc-fun/backend/internal/db"
	routeutils "github.com/b-j-roberts/foc-fun/backend/routes/utils"
)

func InitEventsRoutes() {
	http.HandleFunc("/events/get-latest", getLatestEvent)
	http.HandleFunc("/events/get-events", getEvents)
	http.HandleFunc("/events/get-events-from", getEventsFrom)
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
