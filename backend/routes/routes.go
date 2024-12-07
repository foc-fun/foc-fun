package routes

import (
	"net/http"

	routeutils "github.com/b-j-roberts/foc-fun/backend/routes/utils"
)

func InitBaseRoutes() {
  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    routeutils.SetupHeaders(w)
    w.WriteHeader(http.StatusOK)
  })
}

func InitRoutes() {
  InitBaseRoutes()
}

