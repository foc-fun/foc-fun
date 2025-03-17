package routes

import (
	"net/http"
	"strconv"

	"github.com/b-j-roberts/foc-fun/backend/internal/db"
	routeutils "github.com/b-j-roberts/foc-fun/backend/routes/utils"
)

func InitRegistryRoutes() {
	http.HandleFunc("/registry/get-registered-classes", GetRegisteredClasses)
	http.HandleFunc("/registry/get-registered-contracts", GetRegisteredContracts)
	http.HandleFunc("/registry/get-registered-events", GetRegisteredEvents)
	http.HandleFunc("/registry/get-contracts-events", GetContractsEvents)
}

type RegistryClass struct {
	Id      int    `json:"id"`
	Hash    string `json:"hash"`
	Name    string `json:"name"`
	Version string `json:"version"`
}

func GetRegisteredClasses(w http.ResponseWriter, r *http.Request) {
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

	query := "Select classes.* from classes RIGHT JOIN registeredclasses ON classes.hash = registeredclasses.hash LIMIT $1 OFFSET $2"
	classes, err := db.PostgresQueryJson[RegistryClass](query, pageLength, offset)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error getting registered classes")
		return
	}
	routeutils.WriteDataJson(w, string(classes))
}

type RegistryContract struct {
	Id        int    `json:"id"`
	Address   string `json:"address"`
	ClassHash string `json:"classHash"`
}

func GetRegisteredContracts(w http.ResponseWriter, r *http.Request) {
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

	query := "Select contracts.* from contracts RIGHT JOIN registeredcontracts ON contracts.address = registeredcontracts.address LIMIT $1 OFFSET $2"
	contracts, err := db.PostgresQueryJson[RegistryContract](query, pageLength, offset)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error getting registered contracts")
		return
	}
	routeutils.WriteDataJson(w, string(contracts))
}

type RegistryEvent struct {
	Id              int    `json:"id"`
	ContractAddress string `json:"contractAddress"`
	Selector        string `json:"selector"`
}

func GetRegisteredEvents(w http.ResponseWriter, r *http.Request) {
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

	query := "Select contracts.* from events RIGHT JOIN registeredevents ON events.selector = registeredevents.selector LIMIT $1 OFFSET $2"
	events, err := db.PostgresQueryJson[RegistryEvent](query, pageLength, offset)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error getting registered events")
		return
	}
	routeutils.WriteDataJson(w, string(events))
}

type RegistryContractEvent struct {
	Id              int    `json:"id"`
	ContractAddress string `json:"contractAddress"`
	Selector        string `json:"selector"`
	ClassHash       string `json:"classHash"`
}

func GetContractsEvents(w http.ResponseWriter, r *http.Request) {
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

	query := "Select events.*, contracts.class_hash from events RIGHT JOIN registeredcontracts ON events.contract_address = registeredcontracts.address LIMIT $1 OFFSET $2"
	contractsEvents, err := db.PostgresQueryJson[RegistryContractEvent](query, pageLength, offset)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error getting registered contracts events")
		return
	}
	routeutils.WriteDataJson(w, string(contractsEvents))
}
