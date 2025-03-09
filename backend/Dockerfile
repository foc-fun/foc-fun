FROM golang:1.23.1-alpine

RUN apk add --no-cache bash curl git jq yq

# Copy over the configs
WORKDIR /configs
COPY ./backend/configs/docker.config.yaml /configs/config.yaml

# Copy over the app
WORKDIR /app
COPY ./backend/go.mod ./backend/go.sum ./
RUN go mod download
COPY ./backend .

# Build the app & run it
RUN go build -o foc-fun-api ./cmd/foc-fun-api/main.go

EXPOSE 8080

CMD ["./foc-fun-api"]
