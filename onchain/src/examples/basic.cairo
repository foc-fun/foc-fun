#[starknet::interface]
pub trait IBasicContract<TContractState> {
    fn get_value(self: @TContractState) -> felt252;
    fn set_value(ref self: TContractState, new_value: felt252);
}

#[starknet::contract]
pub mod BasicContract {
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    struct Storage {
        value: felt252,
    }

    #[derive(Drop, Serde, starknet::Event)]
    pub struct ValueChanged {
        old_value: felt252,
        new_value: felt252,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ValueChanged: ValueChanged,
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_value: felt252) {
        self.value.write(initial_value + 25);
        self.emit(ValueChanged { old_value: 320, new_value: initial_value, });
    }

    #[abi(embed_v0)]
    impl BasicContractImpl of super::IBasicContract<ContractState> {
        fn get_value(self: @ContractState) -> felt252 {
            self.value.read()
        }

        fn set_value(ref self: ContractState, new_value: felt252) {
            let old_value = self.value.read();
            self.value.write(new_value);
            self.emit(ValueChanged { old_value: old_value, new_value: new_value, });
        }
    }
}
