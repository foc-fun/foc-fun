'use client';

import Image from "next/image";
import localFont from '@next/font/local'
import { useEffect, useState } from "react";

import { fetchWrapper, devnetMode } from '../utils/apiService';

const pixelsFont = localFont({
  src: [
    {
      path: '../../public/fonts/light-pixel-7/light_pixel-7.ttf',
      weight: '400'
    },
    {
      path: '../../public/fonts/light-pixel-7/light_pixel-7.ttf',
      weight: '700'
    }
  ],
  variable: '--font-pixels'
});

import { Chain, sepolia } from "@starknet-react/chains";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { RpcProvider } from "starknet";
import ControllerConnector from "@cartridge/connector";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

const ETH_TOKEN_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

function provider(_chain: Chain) {
  return new RpcProvider({
    nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia",
  });
}

const StarknetProvider = ({children}: {children: React.ReactNode}) => {
  const connector = new ControllerConnector({
    policies: [
      {
        target: ETH_TOKEN_ADDRESS,
        method: "approve",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      },
      {
        target: ETH_TOKEN_ADDRESS,
        method: "transfer",
      },
      // Add more policies as needed
    ],
    rpc: "https://api.cartridge.gg/x/starknet/sepolia",
    // Uncomment to use a custom theme
    // theme: "dope-wars",
    // colorMode: "light"
  });

  return (
    <StarknetConfig
      autoConnect
      chains={[sepolia]}
      connectors={[connector as any]}
      explorer={starkscan}
      provider={provider}
    >
      {children}
    </StarknetConfig>
  );
}

const App = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const connector = connectors[0] as unknown as ControllerConnector;

  const [username, setUsername] = useState<string>();
  const [queryAddress, setQueryAddress] = useState<string>();
  useEffect(() => {
    if (!address) return;
    connector.username()?.then((n) => setUsername(n));
  }, [address, connector]);

  useEffect(() => {
    const fetchGlobalData = async () => {
      if (!address) return;
      let newQueryAddress = "";
      if (devnetMode) {
        newQueryAddress = "0328ced46664355fc4b885ae7011af202313056a7e3d44827fb24c9d3206aaa0";
      } else {
        newQueryAddress = address.slice(2).toLowerCase().padStart(64, '0');
      }
      setQueryAddress(newQueryAddress);
    }
    fetchGlobalData();
  }, [address]);

  const doConnect = () => {
    const conn = connector as any;
    connect({ connector: conn });
  }

  const projects = [
      {
          "name": "stonks",
          "description": "stonks go brrr",
          "url": "https://foc.fun/stonks",
          "genre": "game",
          "tags": ["game", "fun"],
          "image": "/stonks/preview.png",
          "video": "/stonks/preview.mp4",
          "status": "new",
      },
      {
          "name": "art/peace",
          "description": "Competitive & Collaborative Art",
          "url": "https://art-peace.net",
          "genre": "game",
          "tags": ["game", "fun"],
          "image": "/art-peace/preview.png",
          "video": "/art-peace/preview.mp4",
          "status": "live",
      },
      {
          "name": "Chimera",
          "description": "Merge the elements, build the universe",
          "url": "https://foc.fun/chimera",
          "genre": "game",
          "tags": ["game", "fun"],
          "image": "/chimera/preview.png",
          "video": "/chimera/preview.mp4",
          "status": "coming soon",
      },
      {
          "name": "Cryptle",
          "description": "Daily word puzzles",
          "url": "https://foc.fun/cryptle",
          "genre": "daily",
          "tags": ["word", "puzzle", "daily"],
          "image": "/cryptle/preview.png",
          "video": "/cryptle/preview.mp4",
          "status": "coming soon",
      },
      {
          // Sudoku, Crossword, Word Search, etc.
          "name": "The Daily Paper",
          "description": "The fun part of the news",
          "url": "https://foc.fun/daily-paper",
          "genre": "daily",
          "tags": ["puzzles", "daily"],
          "image": "/daily-paper/preview.png",
          "video": "/daily-paper/preview.mp4",
          "status": "coming soon",
      },
      {
          "name": "Foc Farm",
          "description": "Collect rare breeds",
          "url": "https://foc.fun/foc-farm",
          "genre": "game",
          "tags": ["game", "fun"],
          "image": "/default/preview.png",
          "video": "/default/preview.mp4",
          "status": "coming soon",
      },
  ];

  return (
    <div className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-0 gap-8 ${pixelsFont.variable} font-sans w-full`}>
      <div
          className="fixed top-0 right-0 w-full flex justify-end mx-8 my-4 gap-2"
          style={{ zIndex: 10 }}
      >
           {address && (
             <div className="flex flex-row gap-10 items-center">
                 {username &&
                     <div className="flex flex-row gap-2 items-center">
                     <Image
                         src="/icons/user.png"
                         alt="User"
                         width={20}
                         height={20}
                         className="py-3 px-0"
                     />
                     <p
                         className="text-md text-slate-150 pt-2 mr-1 text-center"
                     >
                         {username}
                     </p>
                     </div>
                 }
             </div>
           )}

          <button
              className="rounded-xl justify-center items-center px-2 pt-2
              bg-gradient-to-br from-[#a021f6] to-[#7001c6] border-2 border-[#7001c6] rounded-full
              text-slate-950 focus:outline-none shadow-sm transition duration-100 ease-in-out hover:scale-[103%] active:scale-[98%] hover:shadow-lg
              hover:cursor-pointer duration-200"
              onClick={() => {
                address ? disconnect() : doConnect();
              }}
          >
            {address ? "Logout" : "Login"}
          </button>
      </div>
      <div
          className="fixed bottom-0 left-0 w-full"
          style={{ zIndex: -2 }}
      >
          <Image
              src="/background/bottom.png"
              alt="Background bottom"
              layout="responsive"
              width={1024}
              height={512}
          />
      </div>
      <div
          className="fixed top-0 left-0 w-full bg-[#00000070] h-full"
          style={{ zIndex: -1 }}
      />
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
        <div className="flex flex-col gap-1 items-center justify-center">
          <h1 className="text-7xl font-bold text-center justify-center tracking-wider">
            foc.fun
          </h1>
          <p className="text-lg text-center sm:text-left">
            games & projects...
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-0 rounded-lg transition-all duration-300 bg-[#00000000]"
                >
                <a
                    href={project.url}
                    style={{ width: "300px" }}
                    className="drop-shadow-md hover:drop-shadow-xl shadow-black border-2 border-slate-900 rounded-lg hover:transform hover:scale-[1.03] transition-transform duration-200 bg-slate-900 relative"
                >
                <div
                    style={{ display: `${project.status === "new" ? "block" : "none"}`, zIndex: 4 }}
                    className="absolute top-[-10px] right-[-10px] p-1 pt-1.5 pl-1.5 text-xs font-bold text-white bg-red-500 rounded-lg drop-shadow-lg animate-bounce"
                >
                    new!
                </div>
                <div className="relative w-full h-56">
                    <video
                        className="absolute w-full h-full object-cover rounded-lg"
                        autoPlay
                        loop
                        muted
                        playsInline
                        src={project.video}
                    />
                    <Image
                        className="absolute w-full h-full object-cover rounded-lg"
                        style={{ imageRendering: "pixelated" }}
                        src={project.image}
                        alt={project.name}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        unoptimized={true}
                    />
                    <div style={{ display: `${project.status === "coming soon" ? "block" : "none"}` }} className="absolute flex items-center justify-center bg-black bg-opacity-70 w-full h-full rounded-lg text-4xl">
                        <p className="text-slate-250 text-center pt-[20%]">coming soon...</p>
                    </div>
                </div>
                </a>
                <div className="flex flex-col gap-0 pl-2 text-slate-200">
                    <h2 className="text-xl font-bold">{project.name}</h2>
                    <p className="text-xs">{project.description}</p>
                </div>
                </div>
            ))}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 pb-4 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/x.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          <p style={{ transform: "translateY(2px)" }} >
            Twitter
          </p>
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/github.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          <p style={{ transform: "translateY(3px)" }} >
            GitHub
          </p>
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/external-link.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          <p style={{ transform: "translateY(3px)" }} >
            Learn More &gt;
          </p>
        </a>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <StarknetProvider>
      <App />
    </StarknetProvider>
  );
}
