package config

import (
	"encoding/json"
	"os"
)

type BackendScriptsConfig struct {
}

type WebSocketConfig struct {
	ReadBufferSize  int `json:"read_buffer_size"`
	WriteBufferSize int `json:"write_buffer_size"`
}

type HttpConfig struct {
	AllowOrigin  []string `json:"allow_origin"`
	AllowMethods []string `json:"allow_methods"`
	AllowHeaders []string `json:"allow_headers"`
}

type BackendConfig struct {
	Host         string               `json:"host"`
	Port         int                  `json:"port"`
	ConsumerPort int                  `json:"consumer_port"`
	Scripts      BackendScriptsConfig `json:"scripts"`
	Production   bool                 `json:"production"`
	WebSocket    WebSocketConfig      `json:"websocket"`
	Http         HttpConfig           `json:"http_config"`
}

var DefaultBackendConfig = BackendConfig{
	Host:         "localhost",
	Port:         8084,
	ConsumerPort: 8085,
	Scripts: BackendScriptsConfig{
	},
	Production: false,
	WebSocket: WebSocketConfig{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	},
	Http: HttpConfig{
		AllowOrigin:  []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Content-Type"},
	},
}

var DefaultBackendConfigPath = "../configs/backend.config.json"

func LoadBackendConfig(backendConfigPath string) (*BackendConfig, error) {
	file, err := os.Open(backendConfigPath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	config := BackendConfig{}
	err = decoder.Decode(&config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}
