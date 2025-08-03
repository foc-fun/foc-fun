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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 pt-20 pb-16">
      <div className="w-full max-w-md flex flex-col text-center p-8
        Background--light rounded-xl shadow-xl font-bold
        border-2 border-[#ffffff] border-opacity-20
      ">
        <h1 className="text-4xl mb-8 text-black">Login!</h1>
        <div className="space-y-4">
          <button
            className="Button__primary w-full py-4 px-6"
            onClick={tryConnectController}
          >
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold">Controller</p>
              <p className="text-sm text-[var(--secondary-dark)] mt-1">No fees + Sessions!</p>
            </div>
          </button>
          {connectors.slice(1).map((connector: any) => (
            <button
              key={connector.name}
              onClick={() => tryConnectWallet(connector)}
              className="Button__primary w-full py-4 px-6"
            >
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">{connector.name}</p>
                <p className="text-sm text-[var(--tertiary-dark)] mt-1">Standard</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Login;
