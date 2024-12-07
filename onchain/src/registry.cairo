#[starknet::interface]
pub trait IFocRegistry<TContractState> {
    fn get_event(ref self: TContractState, event_id: u64) -> FocRegistry::StarknetEvent;
    fn get_event_count(ref self: TContractState) -> u64;
    fn register_event(ref self: TContractState, event: FocRegistry::StarknetEvent);
    fn unregister_event(ref self: TContractState, event_id: u64);
}

#[starknet::contract]
pub mod FocRegistry {
    use core::starknet::ContractAddress;
    use starknet::storage::{Vec, MutableVecTrait};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    struct Storage {
        // Vector mapping: event_id -> event metadata.
        events: Vec<StarknetEvent>,
        // Is the contract in devnet mode.
        devmode: bool,
    }

    #[derive(Drop, Serde, starknet::Store, Clone)]
    pub struct StarknetEvent {
        contract_address: ContractAddress,
        event_selector: felt252
    }

    #[derive(Drop, Serde)]
    pub struct InitParams {
        pub devmode: bool,
    }

    #[derive(Drop, Serde, starknet::Event)]
    pub struct EventRegistered {
        #[key]
        event_id: u64,
        event: StarknetEvent,
    }

    #[derive(Drop, Serde, starknet::Event)]
    pub struct EventUnregistered {
        #[key]
        event_id: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        EventRegistered: EventRegistered,
        EventUnregistered: EventUnregistered,
    }

    #[constructor]
    fn constructor(ref self: ContractState, init_params: InitParams) {
        self.devmode.write(init_params.devmode);
    }

    #[abi(embed_v0)]
    impl FocRegistryImpl of super::IFocRegistry<ContractState> {
        fn get_event(ref self: ContractState, event_id: u64) -> StarknetEvent {
            self.events.at(event_id).read()
        }

        fn get_event_count(ref self: ContractState) -> u64 {
            self.events.len()
        }

        fn register_event(ref self: ContractState, event: StarknetEvent) {
            let event_id = self.events.len();
            self.events.append().write(event.clone());
            self.emit(EventRegistered {
                event_id: event_id,
                event: event,
            });
        }

        fn unregister_event(ref self: ContractState, event_id: u64) {
            self.emit(EventUnregistered { event_id: event_id });
        }

        // TODO: Re-register events, change event contacts, ...
    }
}
