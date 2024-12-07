#!/bin/bash
#
# This script deploys the FOC_REGISTRY contract to the StarkNet devnet in docker

RPC_HOST="devnet"
RPC_PORT=5050

RPC_URL=http://$RPC_HOST:$RPC_PORT

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
WORK_DIR=$SCRIPT_DIR/../..

#TODO: 2 seperate directories when called from the test script
OUTPUT_DIR=$HOME/.foc-tests
TIMESTAMP=$(date +%s)
LOG_DIR=$OUTPUT_DIR/logs/$TIMESTAMP
TMP_DIR=$OUTPUT_DIR/tmp/$TIMESTAMP

# TODO: Clean option to remove old logs and state
#rm -rf $OUTPUT_DIR/logs/*
#rm -rf $OUTPUT_DIR/tmp/*
mkdir -p $LOG_DIR
mkdir -p $TMP_DIR

ACCOUNT_NAME=foc_acct
ACCOUNT_ADDRESS=0x328ced46664355fc4b885ae7011af202313056a7e3d44827fb24c9d3206aaa0
ACCOUNT_PRIVATE_KEY=0x856c96eaa4e7c40c715ccc5dacd8bf6e
ACCOUNT_PROFILE=starknet-devnet
ACCOUNT_FILE=$TMP_DIR/starknet_accounts.json

echo "Creating account \"$ACCOUNT_NAME\"..."
echo "$HOME/.starkli/bin/starkli account fetch $ACCOUNT_ADDRESS --rpc $RPC_URL --network devnet --force --output $ACCOUNT_FILE"
$HOME/.starkli/bin/starkli account fetch $ACCOUNT_ADDRESS --rpc $RPC_URL --network devnet --force --output $ACCOUNT_FILE

CONTRACT_DIR=$WORK_DIR/onchain
#TODO: Error finding file Scarb.toml?
cd $CONTRACT_DIR && $HOME/.local/bin/scarb build

FOC_REGISTRY_CLASS_NAME="FocRegistry"

#TODO: Issue if no declare done
echo "Declaring class \"$FOC_REGISTRY_CLASS_NAME\"..."
FOC_REGISTRY_SIERRA_FILE=$CONTRACT_DIR/target/dev/onchain_FocRegistry.contract_class.json
echo "$HOME/.starkli/bin/starkli declare --private-key $ACCOUNT_PRIVATE_KEY --network devnet --watch $FOC_REGISTRY_SIERRA_FILE --rpc $RPC_URL --account $ACCOUNT_FILE --compiler-version 2.8.2"
FOC_REGISTRY_DECLARE_RESULT=$($HOME/.starkli/bin/starkli declare --private-key $ACCOUNT_PRIVATE_KEY --network devnet --watch $FOC_REGISTRY_SIERRA_FILE --rpc $RPC_URL --account $ACCOUNT_FILE --compiler-version 2.8.2)
FOC_REGISTRY_CLASS_HASH=$(echo $FOC_REGISTRY_DECLARE_RESULT | tail -n 1)
echo "Declared class \"$FOC_REGISTRY_CLASS_NAME\" with hash $FOC_REGISTRY_CLASS_HASH"

DEVNET_MODE=1

CALLDATA=$(echo -n $DEVNET_MODE)

# TODO: calldata passed as parameters
echo "Deploying contract \"$FOC_REGISTRY_CLASS_NAME\"..."
echo "$HOME/.starkli/bin/starkli deploy --private-key $ACCOUNT_PRIVATE_KEY --network devnet --rpc $RPC_URL --account $ACCOUNT_FILE $FOC_REGISTRY_CLASS_HASH $CALLDATA"
FOC_REGISTRY_DEPLOY_RESULT=$($HOME/.starkli/bin/starkli deploy --private-key $ACCOUNT_PRIVATE_KEY --network devnet --rpc $RPC_URL --account $ACCOUNT_FILE $FOC_REGISTRY_CLASS_HASH $CALLDATA)
FOC_REGISTRY_CONTRACT_ADDRESS=$(echo $FOC_REGISTRY_DEPLOY_RESULT)
echo "Deployed contract \"$FOC_REGISTRY_CLASS_NAME\" with address $FOC_REGISTRY_CONTRACT_ADDRESS"

# TODO: Remove these lines?
echo "FOC_REGISTRY_CONTRACT_ADDRESS=$FOC_REGISTRY_CONTRACT_ADDRESS" > /configs/configs.env
echo "REACT_APP_FOC_REGISTRY_CONTRACT_ADDRESS=$FOC_REGISTRY_CONTRACT_ADDRESS" >> /configs/configs.env

