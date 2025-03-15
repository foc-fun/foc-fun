build: build-backend build-frontend build-contracts
test: contracts-test

build-backend:
	@echo "Building backend..."
	@cd backend && rm -rf bin/ && mkdir bin
	@cd backend && go build -o bin ./...

build-frontend:
	@echo "Building frontend..."
	@cd frontend && npm run build

build-contracts:
	@echo "Building contracts..."
	@cd onchain && scarb build

contracts-test:
	@echo "Testing contracts..."
	@cd onchain && scarb test

docker-build:
	$(eval APP_VERSION := $(shell cat infra/foc-fun-infra/Chart.yaml | yq eval '.appVersion' -))
	$(eval COMMIT_SHA := $(shell git rev-parse --short HEAD))
	@echo "Building docker images with version $(APP_VERSION)-$(COMMIT_SHA)"
	@echo "Building backend..."
	docker build . -f backend/Dockerfile.prod -t "brandonjroberts/foc-fun-backend:$(APP_VERSION)-$(COMMIT_SHA)"
	@echo "Building consumer..."
	docker build . -f backend/Dockerfile.consumer.prod -t "brandonjroberts/foc-fun-consumer:$(APP_VERSION)-$(COMMIT_SHA)"
	@echo "Building indexer..."	
	docker build . -f indexer/Dockerfile.prod -t "brandonjroberts/foc-fun-indexer:$(APP_VERSION)-$(COMMIT_SHA)"

docker-push:
	$(eval APP_VERSION := $(shell cat infra/foc-fun-infra/Chart.yaml | yq eval '.appVersion' -))
	$(eval COMMIT_SHA := $(shell git rev-parse --short HEAD))
	@echo "Pushing docker images with version $(APP_VERSION)-$(COMMIT_SHA)"
	@echo "Pushing backend..."
	docker push "brandonjroberts/foc-fun-backend:$(APP_VERSION)-$(COMMIT_SHA)"
	@echo "Pushing consumer..."
	docker push "brandonjroberts/foc-fun-consumer:$(APP_VERSION)-$(COMMIT_SHA)"
	@echo "Pushing indexer..."
	docker push "brandonjroberts/foc-fun-indexer:$(APP_VERSION)-$(COMMIT_SHA)"

helm-uninstall:
	@echo "Uninstalling helm chart..."
	helm uninstall foc-fun-infra

helm-install:
	$(eval COMMIT_SHA := $(shell git rev-parse --short HEAD))
	@echo "Installing helm chart..."
	helm install --set postgres.password=$(POSTGRES_PASSWORD) --set deployments.sha=$(COMMIT_SHA) --set apibara.authToken=$(AUTH_TOKEN) foc-fun-infra infra/foc-fun-infra

helm-template:
	$(eval COMMIT_SHA := $(shell git rev-parse --short HEAD))
	@echo "Rendering helm chart..."
	helm template --set postgres.password=$(POSTGRES_PASSWORD) --set deployments.sha=$(COMMIT_SHA) --set apibara.authToken=$(AUTH_TOKEN) foc-fun-infra infra/foc-fun-infra

helm-upgrade:
	$(eval COMMIT_SHA := $(shell git rev-parse --short HEAD))
	@echo "Upgrading helm chart..."
	helm upgrade --set postgres.password=$(POSTGRES_PASSWORD) --set deployments.sha=$(COMMIT_SHA) --set apibara.authToken=$(AUTH_TOKEN) foc-fun-infra infra/foc-fun-infra
