package indexer

import (
	"encoding/hex"
	"strconv"
)

func readByteArray(data []string, offset int) (string, int, error) {
	dataLengthHex := data[offset]
	dataLength, err := strconv.ParseInt(dataLengthHex, 0, 64)
	if err != nil {
		return "", 0, err
	}

	dataBody := make([]string, 0)
	for i := 1; i <= int(dataLength); i++ {
		dataBody = append(dataBody, data[offset+i][4:])
	}
	pendingDataFull := data[offset+int(dataLength)+1][2:]
	pendingDataLenHex := data[offset+int(dataLength)+2]
	pendingDataLen, err := strconv.ParseInt(pendingDataLenHex, 0, 64)
	if err != nil {
		return "", 0, err
	}
	pendingData := pendingDataFull[len(pendingDataFull)-(int(pendingDataLen)*2):]

	fullString := ""
	for _, s := range dataBody {
		decodedData, err := hex.DecodeString(s)
		if err != nil {
			return "", 0, err
		}
		fullString += string(decodedData)
	}
	pendingDataStr, err := hex.DecodeString(pendingData)
	if err != nil {
		return "", 0, err
	}
	fullString += string(pendingDataStr)

	return fullString, offset + int(dataLength) + 3, nil
}

func readFeltString(data string) (string, error) {
	decodedData, err := hex.DecodeString(data[2:])
	if err != nil {
		return "", err
	}
	trimmedName := []byte{}
	trimming := true
	for _, b := range decodedData {
		if b == 0 && trimming {
			continue
		}
		trimming = false
		trimmedName = append(trimmedName, b)
	}
	feltString := string(trimmedName)
	return feltString, nil
}

func readU256(low string, high string) (string, error) {
	// TODO: Check if this is correct
	return "0x" + high[2:] + low[2:], nil
}

type TransactionCall struct {
	contractAddress string
	selector        string
	calldata        []string
}

type TransactionCalldata struct {
	calls []TransactionCall
}

func parseCalldata(calldata []string) (TransactionCalldata, error) {
	calls := []TransactionCall{}
	callsCount, err := strconv.ParseInt(calldata[0], 0, 64)
	if err != nil {
		return TransactionCalldata{}, err
	}
	offset := 1
	for i := 0; i < int(callsCount); i++ {
		contractAddress := calldata[offset]
		selector := calldata[offset+1]
		callDataLength, err := strconv.ParseInt(calldata[offset+2], 0, 64)
		if err != nil {
			return TransactionCalldata{}, err
		}
		callData := []string{}
		for j := 0; j < int(callDataLength); j++ {
			callData = append(callData, calldata[offset+3+j])
		}
		calls = append(calls, TransactionCall{contractAddress, selector, callData})
		offset += 3 + int(callDataLength)
	}
	return TransactionCalldata{calls}, nil
}
