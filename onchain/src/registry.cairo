use starknet::{ClassHash, ContractAddress};
use core::pedersen::{PedersenTrait};
use core::hash::{HashStateExTrait, HashStateTrait};
use core::serde::{Serde};

#[starknet::interface]
pub trait IFocRegistry<TContractState> {
    // Classes
    fn get_class(self: @TContractState, class_hash: ClassHash) -> FocRegistry::ClassMetadata;
    fn register_class(
        ref self: TContractState, class_hash: ClassHash, class_metadata: FocRegistry::ClassMetadata
    );
    fn unregister_class(ref self: TContractState, class_hash: ClassHash);

    // Contracts
    fn get_contract(
        self: @TContractState, contract_address: ContractAddress
    ) -> FocRegistry::ContractMetadata;
    fn deploy_contract(ref self: TContractState, class_hash: ClassHash, calldata: Span<felt252>) -> ContractAddress;
    fn register_contract(
        ref self: TContractState,
        contract_address: ContractAddress,
        contract_metadata: FocRegistry::ContractMetadata
    );
    fn unregister_contract(ref self: TContractState, contract_address: ContractAddress);
    fn full_setup(
        ref self: TContractState,
        class_hash: ClassHash,
        class_metadata: FocRegistry::ClassMetadata,
        calldata: Span<felt252>,
        events: Span<felt252>,
    );
    fn deploy_and_register(ref self: TContractState, class_hash: ClassHash, calldata: Span<felt252>, events: Span<felt252>) -> ContractAddress;

    // Events
    fn get_event(self: @TContractState, event_id: u64) -> FocRegistry::EventMetadata;
    fn get_event_count(self: @TContractState) -> u64;
    fn register_event(ref self: TContractState, event: FocRegistry::EventMetadata);
    fn unregister_event(ref self: TContractState, event_id: u64);
}

const L2_ADDRESS_UPPER_BOUND: felt252 =
  0x7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00;
const CONTRACT_ADDRESS_PREFIX: felt252 = 'STARKNET_CONTRACT_ADDRESS';
fn compute_hash_on_elements(data: Span<felt252>) -> felt252 {
    let mut state = PedersenTrait::new(0);
    for elem in data {
        state = state.update_with(*elem);
    };

    state.update_with(data.len()).finalize()
}

pub trait SerializedAppend<T> {
    fn append_serde(ref self: Array<felt252>, value: T);
}

impl SerializedAppendImpl<T, impl TSerde: Serde<T>, impl TDrop: Drop<T>> of SerializedAppend<T> {
    fn append_serde(ref self: Array<felt252>, value: T) {
        value.serialize(ref self);
    }
}

// https://github.com/OpenZeppelin/cairo-contracts/blob/bc66fb75b9d9f118d8951ae1afcd71cf2b54102b/packages/utils/src/deployments.cairo#L22C5-L44C2
fn calculate_contract_address_from_deploy_syscall(
    salt: felt252,
    class_hash: ClassHash,
    constructor_calldata: Span<felt252>,
    deployer_address: ContractAddress,
) -> ContractAddress {
    let constructor_calldata_hash = compute_hash_on_elements(constructor_calldata);

    let mut data = array![];
    data.append_serde(CONTRACT_ADDRESS_PREFIX);
    data.append_serde(deployer_address);
    data.append_serde(salt);
    data.append_serde(class_hash);
    data.append_serde(constructor_calldata_hash);
    let raw_address = compute_hash_on_elements(data.span());

    // Felt modulo is discouraged, hence the conversion to u256
    let u256_addr: u256 = raw_address.into() % L2_ADDRESS_UPPER_BOUND.into();
    let felt_addr = u256_addr.try_into().unwrap();

    let mut serialized = array![felt_addr].span();
    Serde::<ContractAddress>::deserialize(ref serialized).unwrap()
}

#[starknet::contract]
pub mod FocRegistry {
    use starknet::{ContractAddress, ClassHash};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess};
    use starknet::storage::{Vec, MutableVecTrait};
    use starknet::storage::{StoragePointerWriteAccess};
    use starknet::syscalls::deploy_syscall;
    use starknet::get_contract_address;

    #[storage]
    struct Storage {
        // Mapping: class_hash -> class metadata.
        classes: Map<ClassHash, ClassMetadata>,
        // Mapping: contract_address -> contract metadata.
        contracts: Map<ContractAddress, ContractMetadata>,
        // Vector mapping: event_id -> event metadata.
        events: Vec<EventMetadata>,
        version: felt252,
        // TODO: manage salt elsewhere
        salt: felt252,
    }

    #[derive(Drop, Serde, starknet::Store, Clone)]
    pub struct ClassMetadata {
        name: felt252,
        version: felt252,
    }

    #[derive(Drop, Serde, starknet::Store, Clone)]
    pub struct ContractMetadata {
        class_hash: ClassHash,
    }

    #[derive(Drop, Serde, starknet::Store, Clone)]
    pub struct EventMetadata {
        contract_address: ContractAddress,
        event_selector: felt252
    }

    #[derive(Drop, Serde)]
    pub struct InitParams {
        version: felt252,
    }

    #[derive(Drop, Serde, starknet::Event)]
    pub struct ClassRegistered {
        #[key]
        class_hash: ClassHash,
        class: ClassMetadata,
    }

    #[derive(Drop, Serde, starknet::Event)]
    pub struct ClassUnregistered {
        #[key]
        class_hash: ClassHash,
    }

    #[derive(Drop, Serde, starknet::Event)]
    pub struct ContractRegistered {
        #[key]
        contract_address: ContractAddress,
        contract: ContractMetadata,
    }

    #[derive(Drop, Serde, starknet::Event)]
    pub struct ContractUnregistered {
        #[key]
        contract_address: ContractAddress,
    }

    #[derive(Drop, Serde, starknet::Event)]
    pub struct EventRegistered {
        #[key]
        event_id: u64,
        event: EventMetadata,
    }

    #[derive(Drop, Serde, starknet::Event)]
    pub struct EventUnregistered {
        #[key]
        event_id: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ClassRegistered: ClassRegistered,
        ClassUnregistered: ClassUnregistered,
        ContractRegistered: ContractRegistered,
        ContractUnregistered: ContractUnregistered,
        EventRegistered: EventRegistered,
        EventUnregistered: EventUnregistered,
    }

    #[constructor]
    fn constructor(ref self: ContractState, init_params: InitParams) {
        self.version.write(init_params.version);
    }

    #[abi(embed_v0)]
    impl FocRegistryImpl of super::IFocRegistry<ContractState> {
        fn get_class(self: @ContractState, class_hash: ClassHash) -> ClassMetadata {
            self.classes.read(class_hash)
        }

        fn register_class(
            ref self: ContractState, class_hash: ClassHash, class_metadata: ClassMetadata
        ) {
            self.classes.write(class_hash, class_metadata.clone());
            self.emit(ClassRegistered { class_hash: class_hash, class: class_metadata, });
        }

        fn unregister_class(ref self: ContractState, class_hash: ClassHash) {
            self.emit(ClassUnregistered { class_hash: class_hash });
        }

        fn get_contract(
            self: @ContractState, contract_address: ContractAddress
        ) -> ContractMetadata {
            self.contracts.read(contract_address)
        }

        fn deploy_contract(
            ref self: ContractState, class_hash: ClassHash, calldata: Span<felt252>
        ) -> ContractAddress {
            let salt = self.salt.read();
            let deploy_res = deploy_syscall(class_hash, salt, calldata, false);
            if deploy_res.is_err() {
                panic!("Failed to deploy canvas contract");
            }
            let (addr, _response) = deploy_res.unwrap();
            self.register_contract(addr, ContractMetadata { class_hash: class_hash });
            self.salt.write(salt + 1);
            addr
        }

        fn register_contract(
            ref self: ContractState,
            contract_address: ContractAddress,
            contract_metadata: ContractMetadata
        ) {
            self.contracts.write(contract_address, contract_metadata.clone());
            self
                .emit(
                    ContractRegistered {
                        contract_address: contract_address, contract: contract_metadata,
                    }
                );
        }

        fn unregister_contract(ref self: ContractState, contract_address: ContractAddress) {
            self.emit(ContractUnregistered { contract_address: contract_address });
        }

        fn get_event(self: @ContractState, event_id: u64) -> EventMetadata {
            self.get_event(event_id)
        }

        fn get_event_count(self: @ContractState) -> u64 {
            self.get_event_count()
        }

        fn register_event(ref self: ContractState, event: EventMetadata) {
            let event_id = self.events.len();
            self.events.push(event.clone());
            self.emit(EventRegistered { event_id: event_id, event: event, });
        }

        fn unregister_event(ref self: ContractState, event_id: u64) {
            self.emit(EventUnregistered { event_id: event_id });
        }

        fn full_setup(
            ref self: ContractState,
            class_hash: ClassHash,
            class_metadata: ClassMetadata,
            calldata: Span<felt252>,
            events: Span<felt252>,
        ) {
            // TODO: All checks in all functions ( ex: check if class is registered, check if contract is registered, ...)
            self.register_class(class_hash, class_metadata);
            self.deploy_and_register(class_hash, calldata, events);
        }

        fn deploy_and_register(ref self: ContractState, class_hash: ClassHash, calldata: Span<felt252>, events: Span<felt252>) -> ContractAddress {
          // Check if class is registered
          let class_metadata = self.classes.read(class_hash);
          assert!(class_metadata.name != 0, "Class not registered");

          let registry_contract: ContractAddress = get_contract_address();
          let pre_contract_address = super::calculate_contract_address_from_deploy_syscall(
              self.salt.read(), class_hash, calldata, registry_contract
          );
          // TODO: Check if contract is already registered
          for event in events {
              self.register_event(EventMetadata { contract_address: pre_contract_address, event_selector: *event });
          };

          // Deploy contract
          let contract_address = self.deploy_contract(class_hash, calldata);

          contract_address
        }
        // TODO: Re-register events, change event contacts, ...
    }
}
