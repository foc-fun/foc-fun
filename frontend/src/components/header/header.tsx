import Image from "next/image";
import { NavLink } from "react-router";
import logo from "../../app/icon.png";

// TODO: Underline selected tab
export const Header = (props: any) => {
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
        <button
            className="ml-6 pt-2 px-3 Button__primary"
            onClick={() => {
            }}
        >
          {false ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
}
