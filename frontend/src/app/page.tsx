'use client';

import Image from "next/image";
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import { StarknetProvider } from "../components/StarknetProvider";
import { Header } from "../components/header/header";
import Play from "../components/screens/play";
import Engine from "../components/screens/engine";

const App = () => {
  return (
    <div className="h-[100vh] w-[100vw] relative">
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Play />} />
          <Route path="/play" element={<Play />} />
          <Route path="/engine" element={<Engine />} />
        </Routes>
      </BrowserRouter>
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
    </div>
  );
}

export default function Home() {
  return (
    <StrictMode>
      <StarknetProvider>
        <App />
      </StarknetProvider>
    </StrictMode>
  );
}
