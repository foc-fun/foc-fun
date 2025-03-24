package routes

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"

	"github.com/b-j-roberts/foc-fun/backend/internal/db"
	routeutils "github.com/b-j-roberts/foc-fun/backend/routes/utils"
)

func InitRegistryRoutes() {
	http.HandleFunc("/registry/get-registered-classes", GetRegisteredClasses)
	http.HandleFunc("/registry/get-registered-contracts", GetRegisteredContracts)
	http.HandleFunc("/registry/get-registered-events", GetRegisteredEvents)
	http.HandleFunc("/registry/get-contracts-events", GetContractsEvents)

	// Serve the ABI files
	http.HandleFunc("/registry/add-contract-class", AddContractClass)
	http.HandleFunc("/registry/get-contract-class", GetContractClass)
	http.HandleFunc("/registry/get-contract-class-type", GetContractClassType)
	http.HandleFunc("/registry/get-starknet-typed-data", GetStarknetTypedData)
	http.HandleFunc("/registry/get-starknet-typed-data-min", GetStarknetTypedDataMin)
	http.Handle("/abis/", http.StripPrefix("/abis/", http.FileServer(http.Dir("./abis"))))
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

func AddContractClass(w http.ResponseWriter, r *http.Request) {
	file, _, err := r.FormFile("contract")
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Error getting contract file")
		return
	}
	defer file.Close()

	r.ParseForm()
	contractClassHash := r.Form.Get("hash")

	if _, err := os.Stat("abis"); os.IsNotExist(err) {
		err := os.Mkdir("abis", os.ModePerm)
		if err != nil {
			routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error creating abis directory")
			return
		}
	}

	filename := "abis/" + contractClassHash + ".json"
	if _, err := os.Stat(filename); err == nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Contract class already exists")
		return
	}

	out, err := os.Create(filename)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error creating contract class file")
		return
	}
	defer out.Close()

	_, err = io.Copy(out, file)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error copying contract class file")
		return
	}

	routeutils.WriteResultJson(w, "Contract class added")
}

/*
type AbiImpl struct {
  Type string `json:"type"`
  Name string `json:"name"`
  InterfaceName string `json:"interface_name"`
}

type AbiParam struct {
  Name string `json:"name"`
  Type string `json:"type"`
  Kind string `json:"kind"`
}

type AbiResult struct {
  Type string `json:"type"`
}

type AbiFunction struct {
  Type string `json:"type"`
  Name string `json:"name"`
  Inputs []AbiParam `json:"inputs"`
  Outputs []AbiResult `json:"outputs"`
  StateMutability string `json:"state_mutability"`
}

type AbiInterface struct {
  Type string `json:"type"`
  Name string `json:"name"`
  Items []AbiFunction `json:"items"`
}

type AbiConstructor struct {
  Type string `json:"type"`
  Name string `json:"name"`
  Inputs []AbiParam `json:"inputs"`
}

type AbiEvent struct {
  Type string `json:"type"`
  Name string `json:"name"`
  Kind string `json:"kind"`
  Members []AbiParam `json:"members"`
  Variants []AbiParam `json:"variants"`
}

type AbiType struct {
  // Abi is an array of any of the following types:
  // AbiImpl, AbiInterface, AbiConstructor, AbiEvent
  Abi []interface{}
}
*/

type ContractClass struct {
	// TODO: SierraProgram []string `json:"sierra_program"`
	// TODO: SierraProgramDebugInfo
	// TODO: ContractClassVersion
	// TODO: EntryPointsByType
	Abi []interface{} `json:"abi"`
}

func GetContractClass(w http.ResponseWriter, r *http.Request) {
	contractClassHash := r.URL.Query().Get("hash")
	filename := "abis/" + contractClassHash + ".json"
	if _, err := os.Stat(filename); err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Contract class does not exist")
		return
	}

	file, err := os.Open(filename)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error opening contract class file")
		return
	}
	defer file.Close()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error reading contract class file")
		return
	}
	var contractClass ContractClass
	err = json.Unmarshal(fileBytes, &contractClass)
	if err != nil {
		fmt.Println(err)
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error unmarshalling contract class file")
		return
	}

	contractClassJson, err := json.Marshal(contractClass)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error marshalling contract class")
		return
	}

	routeutils.WriteDataJson(w, string(contractClassJson))
}

func GetContractClassType(w http.ResponseWriter, r *http.Request) {
	contractClassHash := r.URL.Query().Get("hash")
	filename := "abis/" + contractClassHash + ".json"
	if _, err := os.Stat(filename); err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Contract class does not exist")
		return
	}

	typeName := r.URL.Query().Get("type")
	if typeName == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Type not specified")
		return
	}

	file, err := os.Open(filename)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error opening contract class file")
		return
	}
	defer file.Close()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error reading contract class file")
		return
	}

	var contractClass ContractClass
	err = json.Unmarshal(fileBytes, &contractClass)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error unmarshalling contract class file")
		return
	}

	abi := contractClass.Abi
	typeNameJson := ParseStarknetType(typeName, abi)
	typeNameJsonBytes, err := json.Marshal(typeNameJson)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error marshalling type name")
		return
	}

	routeutils.WriteDataJson(w, string(typeNameJsonBytes))
}

func GetStarknetTypedData(w http.ResponseWriter, r *http.Request) {
	contractClassHash := r.URL.Query().Get("hash")
	filename := "abis/" + contractClassHash + ".json"
	if _, err := os.Stat(filename); err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Contract class does not exist")
		return
	}

	typeName := r.URL.Query().Get("type")
	if typeName == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Type not specified")
		return
	}

	file, err := os.Open(filename)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error opening contract class file")
		return
	}
	defer file.Close()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error reading contract class file")
		return
	}

	var contractClass ContractClass
	err = json.Unmarshal(fileBytes, &contractClass)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error unmarshalling contract class file")
		return
	}

	abi := contractClass.Abi
	testData := []string{"0x1", "0x2", "0x3"}
	typeNameJson := StarknetTypeData(typeName, abi, testData)
	typeNameJsonBytes, err := json.Marshal(typeNameJson)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error marshalling type name")
		return
	}

	routeutils.WriteDataJson(w, string(typeNameJsonBytes))
}

func GetStarknetTypedDataMin(w http.ResponseWriter, r *http.Request) {
	contractClassHash := r.URL.Query().Get("hash")
	filename := "abis/" + contractClassHash + ".json"
	if _, err := os.Stat(filename); err != nil {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Contract class does not exist")
		return
	}

	typeName := r.URL.Query().Get("type")
	if typeName == "" {
		routeutils.WriteErrorJson(w, http.StatusBadRequest, "Type not specified")
		return
	}

	file, err := os.Open(filename)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error opening contract class file")
		return
	}
	defer file.Close()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error reading contract class file")
		return
	}

	var contractClass ContractClass
	err = json.Unmarshal(fileBytes, &contractClass)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error unmarshalling contract class file")
		return
	}

	abi := contractClass.Abi
	testData := []string{"0x1", "0x2", "0x3"}
	typeNameJson := StarknetTypeDataMin(typeName, abi, testData)
	typeNameJsonBytes, err := json.Marshal(typeNameJson)
	if err != nil {
		routeutils.WriteErrorJson(w, http.StatusInternalServerError, "Error marshalling type name")
		return
	}

	routeutils.WriteDataJson(w, string(typeNameJsonBytes))
}

type TypeInfo struct {
	Type string `json:"type"`
	Name string `json:"name"`
}

type TypesInfo struct {
	Primitives []TypeInfo `json:"primitives"`
	Array      []TypeInfo `json:"array"`
}

var Types = TypesInfo{
	Primitives: []TypeInfo{
		{
			Type: "core::byte_array::ByteArray",
			Name: "string",
		},
		{
			Type: "core::felt252",
			Name: "felt",
		},
		{
			Type: "core::integer::u8",
			Name: "u8",
		},
		{
			Type: "core::integer::u16",
			Name: "u16",
		},
		{
			Type: "core::integer::u32",
			Name: "u32",
		},
		{
			Type: "core::integer::u64",
			Name: "u64",
		},
		{
			Type: "core::integer::u128",
			Name: "u128",
		},
		{
			Type: "core::integer::u256",
			Name: "u256",
		},
		{
			Type: "core::integer::i8",
			Name: "i8",
		},
		{
			Type: "core::integer::i16",
			Name: "i16",
		},
		{
			Type: "core::integer::i32",
			Name: "i32",
		},
		{
			Type: "core::integer::i64",
			Name: "i64",
		},
		{
			Type: "core::integer::i128",
			Name: "i128",
		},
		{
			Type: "core::bool",
			Name: "bool",
		},
		{
			Type: "core::starknet::contract_address::ContractAddress",
			Name: "address",
		},
	},
	Array: []TypeInfo{
		{
			Type: "core::array::Array",
			Name: "array",
		},
		{
			Type: "core::span::Span",
			Name: "span",
		},
	},
}

var StarknetTypeParsers = map[string]func(string, string) interface{}{
	"core::byte_array::ByteArray": func(typeName string, data string) interface{} {
		// TODO: Parse byte array
		return data
	},
	"core::felt252": func(typeName string, data string) interface{} {
		return data
	},
	"core::integer::u8": func(typeName string, data string) interface{} {
		val, err := strconv.ParseUint(data, 0, 8)
		if err != nil {
			return nil
		}
		return val
	},
	"core::integer::u16": func(typeName string, data string) interface{} {
		val, err := strconv.ParseUint(data, 0, 16)
		if err != nil {
			return nil
		}
		return val
	},
	"core::integer::u32": func(typeName string, data string) interface{} {
		val, err := strconv.ParseUint(data, 0, 32)
		if err != nil {
			fmt.Println(err)
			return nil
		}
		return val
	},
	"core::integer::u64": func(typeName string, data string) interface{} {
		val, err := strconv.ParseUint(data, 16, 64)
		if err != nil {
			return nil
		}
		return val
	},
	"core::integer::u128": func(typeName string, data string) interface{} {
		val, err := strconv.ParseUint(data, 0, 128)
		if err != nil {
			return nil
		}
		return val
	},
	"core::integer::u256": func(typeName string, data string) interface{} {
		// TODO
		val, err := strconv.ParseUint(data, 0, 256)
		if err != nil {
			return nil
		}
		return val
	},
	"core::integer::i8": func(typeName string, data string) interface{} {
		val, err := strconv.ParseInt(data, 0, 8)
		if err != nil {
			return nil
		}
		return val
	},
	"core::integer::i16": func(typeName string, data string) interface{} {
		val, err := strconv.ParseInt(data, 0, 16)
		if err != nil {
			return nil
		}
		return val
	},
	"core::integer::i32": func(typeName string, data string) interface{} {
		val, err := strconv.ParseInt(data, 0, 32)
		if err != nil {
			return nil
		}
		return val
	},
	"core::integer::i64": func(typeName string, data string) interface{} {
		val, err := strconv.ParseInt(data, 0, 64)
		if err != nil {
			return nil
		}
		return val
	},
	"core::integer::i128": func(typeName string, data string) interface{} {
		val, err := strconv.ParseInt(data, 0, 128)
		if err != nil {
			return nil
		}
		return val
	},
	"core::bool": func(typeName string, data string) interface{} {
		val, err := strconv.ParseBool(data)
		if err != nil {
			return nil
		}
		return val
	},
	"core::starknet::contract_address::ContractAddress": func(typeName string, data string) interface{} {
		return data
	},
}

func IsPrimitiveType(typeName string) bool {
	for _, primitive := range Types.Primitives {
		if primitive.Type == typeName {
			return true
		}
	}
	return false
}

func stringStartsWith(s string, prefix string) bool {
	return len(s) >= len(prefix) && s[:len(prefix)] == prefix
}
func stringEndsWith(s string, suffix string) bool {
	return len(s) >= len(suffix) && s[len(s)-len(suffix):] == suffix
}

func IsArrayType(typeName string) bool {
	for _, array := range Types.Array {
		if typeName == array.Type || stringStartsWith(typeName, array.Type+"<") {
			return true
		}
	}
	return false
}

func IsStructType(typeName string) bool {
	return !IsPrimitiveType(typeName) && !IsArrayType(typeName)
}

func GetTypeName(typeName string) string {
	for _, primitive := range Types.Primitives {
		if primitive.Type == typeName {
			return primitive.Name
		}
	}
	for _, array := range Types.Array {
		if typeName == array.Type {
			return array.Name
		}
		if stringStartsWith(typeName, array.Type+"<") {
			return GetTypeName(typeName[len(array.Type)+1 : len(typeName)-1])
		}
	}
	return typeName
}

func ParseStarknetType(typeName string, abi interface{}) interface{} {
	if IsPrimitiveType(typeName) {
		return map[string]interface{}{
			"kind":    "primitive",
			"rawType": typeName,
			"type":    GetTypeName(typeName),
		}
	} else if IsArrayType(typeName) {
		return map[string]interface{}{
			"kind":    "array",
			"rawType": typeName,
			"type":    GetTypeName(typeName),
		}
	} else if IsStructType(typeName) {
		fields := []interface{}{}
		for _, abi := range abi.([]interface{}) {
			// TODO: Allow ends with ::typeName
			if abi.(map[string]interface{})["name"] == typeName ||
				stringEndsWith(abi.(map[string]interface{})["name"].(string), "::"+typeName) {
				for _, member := range abi.(map[string]interface{})["members"].([]interface{}) {
					fields = append(fields, map[string]interface{}{
						"name": member.(map[string]interface{})["name"],
						"type": ParseStarknetType(member.(map[string]interface{})["type"].(string), abi),
					})
				}
				break
			}
		}
		return map[string]interface{}{
			"kind":    "struct",
			"rawType": typeName,
			"type":    GetTypeName(typeName),
			"fields":  fields,
		}
	}
	return map[string]interface{}{
		"kind":    "unknown",
		"rawType": typeName,
		"type":    GetTypeName(typeName),
	}
}

// TODO: Check valid data
func StarknetTypeData(typeName string, abi interface{}, data []string) interface{} {
	if IsPrimitiveType(typeName) {
		return map[string]interface{}{
			"kind":    "primitive",
			"rawType": typeName,
			"type":    GetTypeName(typeName),
			"data":    data[0],
		}
	} else if IsArrayType(typeName) {
		// TODO: Fix this w/ array length info
		return map[string]interface{}{
			"kind":    "array",
			"rawType": typeName,
			"type":    GetTypeName(typeName),
			"data":    data,
		}
	} else if IsStructType(typeName) {
		fields := []interface{}{}
		for _, abi := range abi.([]interface{}) {
			if abi.(map[string]interface{})["name"] == typeName ||
				stringEndsWith(abi.(map[string]interface{})["name"].(string), "::"+typeName) {
				for i, member := range abi.(map[string]interface{})["members"].([]interface{}) {
					fields = append(fields, map[string]interface{}{
						"name": member.(map[string]interface{})["name"],
						"type": StarknetTypeData(member.(map[string]interface{})["type"].(string), abi, []string{data[i]}),
					})
				}
				break
			}
		}
		return map[string]interface{}{
			"kind":    "struct",
			"rawType": typeName,
			"type":    GetTypeName(typeName),
			"fields":  fields,
		}
	}
	return nil
}

func StarknetStringToTypedData(typeName string, data string) interface{} {
	if IsPrimitiveType(typeName) {
		return StarknetTypeParsers[typeName](typeName, data)
	} else {
		fmt.Println("Not a primitive type")
		// TODO: Error?
	}
	return nil
}

// TODO: Check valid data
// TODO: Parse data based on type
func StarknetTypeDataMin(typeName string, abi interface{}, data []string) interface{} {
	if IsPrimitiveType(typeName) {
		return StarknetStringToTypedData(typeName, data[0])
	} else if IsArrayType(typeName) {
		return data
	} else if IsStructType(typeName) {
		fields := map[string]interface{}{}
		for _, abi := range abi.([]interface{}) {
			if abi.(map[string]interface{})["name"] == typeName ||
				stringEndsWith(abi.(map[string]interface{})["name"].(string), "::"+typeName) {
				for i, member := range abi.(map[string]interface{})["members"].([]interface{}) {
					memberName := member.(map[string]interface{})["name"]
					fields[memberName.(string)] = StarknetTypeDataMin(member.(map[string]interface{})["type"].(string), abi, []string{data[i]})
				}
				break
			}
		}
		return fields
	}
	return nil
}
