#!/bin/bash
#
# Initialize onchain contracts

sleep 10

echo "Initializing onchain contracts..."

echo "Deploying the application"
./deploy.sh

echo "Set the backend contract addresses"
CONTRACT_ADDRESS=$(cat /configs/configs.env | grep "^FOC_REGISTRY_CONTRACT_ADDRESS" | cut -d '=' -f2)
curl http://backend:8080/set-registry-contract-address -X POST -d "$CONTRACT_ADDRESS"

