use starknet::{ContractAddress, contract_address_const};
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

// use onchain::registry::IFocRegistrySafeDispatcher;
// use onchain::registry::IFocRegistrySafeDispatcherTrait;
// use onchain::registry::IFocRegistryDispatcher;
// use onchain::registry::IFocRegistryDispatcherTrait;
use onchain::registry::FocRegistry;

fn deploy_contract() -> ContractAddress {
    let contract = declare("FocRegistry").unwrap().contract_class();
    let calldata = FocRegistry::InitParams {
        devmode: true,
    };
    let mut calldata_ser = array![];
    calldata.serialize(ref calldata_ser);
    let (contract_address, _) = contract.deploy(@calldata_ser).unwrap();
    contract_address
}

#[test]
fn test_contract_deploys() {
    let contract_address = deploy_contract();
    let zero_address = contract_address_const::<0>();
    assert(contract_address != zero_address, 'Invalid contract address');
}

// TODO: Test registry contract
