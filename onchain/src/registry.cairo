use core::starknet::ContractAddress;
use core::starknet::{ClassHash};

#[starknet::interface]
pub trait IFocRegistry<TContractState> {
    // Classes
    fn get_class(self: @TContractState, class_hash: felt252) -> FocRegistry::ClassMetadata;
    fn register_class(
        ref self: TContractState, class_hash: felt252, class_metadata: FocRegistry::ClassMetadata
    );
    fn unregister_class(ref self: TContractState, class_hash: felt252);

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

    // Events
    fn get_event(self: @TContractState, event_id: u64) -> FocRegistry::EventMetadata;
    fn get_event_count(self: @TContractState) -> u64;
    fn register_event(ref self: TContractState, event: FocRegistry::EventMetadata);
    fn unregister_event(ref self: TContractState, event_id: u64);
}

#[starknet::contract]
pub mod FocRegistry {
    use core::starknet::ContractAddress;
    use core::starknet::{ClassHash};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};
    use starknet::storage::{Vec, MutableVecTrait};
    use starknet::storage::{StoragePointerWriteAccess};
    use starknet::syscalls::deploy_syscall;

    #[storage]
    struct Storage {
        // Mapping: class_hash -> class metadata.
        classes: Map<felt252, ClassMetadata>,
        // Mapping: contract_address -> contract metadata.
        contracts: Map<ContractAddress, ContractMetadata>,
        // Vector mapping: event_id -> event metadata.
        events: Vec<EventMetadata>,
        version: felt252,
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
        class_hash: felt252,
        class: ClassMetadata,
    }

    #[derive(Drop, Serde, starknet::Event)]
    pub struct ClassUnregistered {
        #[key]
        class_hash: felt252,
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
        fn get_class(self: @ContractState, class_hash: felt252) -> ClassMetadata {
            self.classes.read(class_hash)
        }

        fn register_class(
            ref self: ContractState, class_hash: felt252, class_metadata: ClassMetadata
        ) {
            self.classes.write(class_hash, class_metadata.clone());
            self.emit(ClassRegistered { class_hash: class_hash, class: class_metadata, });
        }

        fn unregister_class(ref self: ContractState, class_hash: felt252) {
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
            // TODO: salt
            let deploy_res = deploy_syscall(class_hash, 0, calldata, false);
            if deploy_res.is_err() {
                panic!("Failed to deploy canvas contract");
            }
            let (addr, _response) = deploy_res.unwrap();
            self.register_contract(addr, ContractMetadata { class_hash: class_hash });
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
            self.events.append().write(event.clone());
            self.emit(EventRegistered { event_id: event_id, event: event, });
        }

        fn unregister_event(ref self: ContractState, event_id: u64) {
            self.emit(EventUnregistered { event_id: event_id });
        }
        // TODO: Re-register events, change event contacts, ...
    }
}
