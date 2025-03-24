import Image from "next/image";
import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import ControllerConnector from "@cartridge/connector/controller";
import logo from "../../app/icon.png";
import logout from "../../../public/icons/logout.png";

// TODO: Underline selected tab
export const Header = () => {
  const { address } = useAccount();
  const { connector } = useConnect();
  const { disconnect } = useDisconnect();
  const [username, setUsername] = useState<string>();
  useEffect(() => {
    if (!address) return;
    const controller = connector as ControllerConnector;
    if (!controller.username) {
      setUsername(`${address.slice(0, 6)}...${address.slice(-4)}`);
    } else {
      controller.username()?.then((n) => setUsername(n));
    }
  }, [address, connector]);

  return (
    <div
      className="fixed top-0 left-0 w-full flex justify-between items-center z-[100] py-2 px-6"
    >
      <div className="flex items-center">
        <NavLink to="/">
          <Image
            src={logo}
            alt="Logo"
            className="w-[6rem] cursor-pointer"
          />
        </NavLink>
        <NavLink to="/">
          <h1 className="text-[3rem] font-bold ml-4 pt-4 cursor-pointer">foc.fun</h1>
        </NavLink>
        <h2 className="text-[1rem] ml-2 pt-10">Alpha</h2>
      </div>
      <div className="flex items-center">
        <NavLink
            to="/play"
            className="text-[1.4rem] pt-2 px-3 Button__empty"
        >
          Play
        </NavLink>
        <NavLink
            to="/engine"
            className="text-[1.4rem] pt-2 px-3 Button__empty"
        >
          Engine
        </NavLink>
        {address ? (
          <div className="flex items-center">
          <button
            className="ml-6 pt-2 px-3 Button__primary"
          >
            {username}
          </button>
          <button
            className="ml-2 p-[0.4rem] Button__primary Background--none"
            onClick={() => disconnect()}
          >
            <Image
              src={logout}
              alt="Logout"
              className="w-[2.2rem] h-[2.2rem]"
            />
          </button>
          </div>
        ) : (
          <NavLink
            className="ml-6 pt-2 px-3 Button__primary"
            to="/login"
          >
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
}
