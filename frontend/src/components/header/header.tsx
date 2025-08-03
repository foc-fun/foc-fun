import Image from "next/image";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import ControllerConnector from "@cartridge/connector/controller";
import logo from "../../app/icon.png";
import { Button } from "../ui";

export const Header = () => {
  const { address } = useAccount();
  const { connector } = useConnect();
  const { disconnect } = useDisconnect();
  const location = useLocation();
  const [username, setUsername] = useState<string>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!address) return;
    const controller = connector as ControllerConnector;
    if (!controller.username) {
      setUsername(`${address.slice(0, 6)}...${address.slice(-4)}`);
    } else {
      controller.username()?.then((n) => setUsername(n));
    }
  }, [address, connector]);

  const navItems = [
    { path: '/play', label: 'Play', internal: true },
    { path: '/build', label: 'Build', internal: true },
    { path: '/about', label: 'About', internal: true }
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/play' && (location.pathname === '/' || location.pathname === '/play')) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md border-b border-gray-200/10 z-50">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image
                src={logo}
                alt="foc.fun logo"
                className="w-12 h-12"
                priority
              />
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl font-bold">foc.fun</h1>
                <span className="badge badge-primary text-xs">Alpha</span>
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              item.internal ? (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-pixel text-sm transition-all ${
                    isActiveRoute(item.path)
                      ? 'bg-primary text-white'
                      : 'text-foreground hover:bg-gray-100/10'
                  }`}
                >
                  {item.label}
                </NavLink>
              ) : (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg font-pixel text-sm text-foreground hover:bg-gray-100/10 transition-all flex items-center gap-1"
                >
                  {item.label}
                  <span className="text-xs">↗</span>
                </a>
              )
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {address ? (
              <>
                <Button variant="ghost" size="sm">
                  {username}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => disconnect()}
                  className="btn-icon"
                >
                  <span className="text-lg">⏻</span>
                </Button>
              </>
            ) : (
              <NavLink to="/login">
                <Button variant="primary" size="sm">
                  Login
                </Button>
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 bg-foreground transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-foreground transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-foreground transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-gray-200/10 animate-fade-in">
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                item.internal ? (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg font-pixel text-sm transition-all ${
                      isActiveRoute(item.path)
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-gray-100/10'
                    }`}
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg font-pixel text-sm text-foreground hover:bg-gray-100/10 transition-all flex items-center justify-between"
                  >
                    {item.label}
                    <span className="text-xs">↗</span>
                  </a>
                )
              ))}
              
              <div className="mt-2 pt-2 border-t border-gray-200/10">
                {address ? (
                  <div className="flex flex-col gap-2">
                    <div className="px-4 py-2 text-sm text-muted">{username}</div>
                    <button
                      onClick={() => {
                        disconnect();
                        setIsMenuOpen(false);
                      }}
                      className="px-4 py-3 rounded-lg font-pixel text-sm text-foreground hover:bg-gray-100/10 text-left"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <Button variant="primary" size="sm" fullWidth>
                      Login
                    </Button>
                  </NavLink>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};