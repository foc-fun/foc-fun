'use client';

import { useConnect } from '@starknet-react/core';
import ControllerConnector from "@cartridge/connector/controller";

const Login = () => {
  const { connect, connectors } = useConnect();
  const controller = connectors[0] as ControllerConnector;

  const tryConnectController = () => {
    try {
      connect({ connector: controller });
    } catch (e) {
      console.log(e);
    }
  }

  const tryConnectWallet = (connector: any) => {
    try {
      connect({ connector: connector });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="w-full h-full flex flex-row justify-center items-center bg-[#000000d0]">
      <div className="w-[40rem] flex flex-col text-center pb-[1rem]
        Background--light rounded-xl shadow-xl font-bold
        border-2 border-[#ffffff] border-opacity-20
      ">
        <h1 className="text-[3.4rem] py-[2rem] mb-[1rem] text-black">Login!</h1>
        <button
          className="Button__primary pt-[1rem] pb-[0.5rem] mx-[4rem] mb-[1rem]"
          onClick={tryConnectController}
        >
          <p className="text-[1.6rem]">Controller</p>
          <p className="text-[1rem] text-[var(--secondary-dark)]">No fees + Sessions!</p>
        </button>
        {connectors.slice(1).map((connector: any) => (
          <button
            key={connector.name}
            onClick={() => tryConnectWallet(connector)}
            className="Button__primary pt-[1rem] pb-[0.5rem] mx-[4rem] mb-[1rem]"
          >
            <p className="text-[1.6rem]">{connector.name}</p>
            <p className="text-[1rem] text-[var(--tertiary-dark)]">Standard</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Login;
