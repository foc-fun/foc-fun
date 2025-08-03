'use client';

import Image from "next/image";
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import { StarknetProvider } from "../components/StarknetProvider";
import { Header } from "../components/header/header";
import Play from "../components/screens/play";
import Engine from "../components/screens/engine";
import Login from "../components/screens/login";
import About from "../components/screens/about";
import Build from "../components/screens/build";

const App = () => {
  return (
    <div className="min-h-screen relative">
      {typeof window !== "undefined" && (
        <BrowserRouter>
          <Header/>
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<Play />} />
              <Route path="/play" element={<Play />} />
              <Route path="/build" element={<Build />} />
              <Route path="/engine" element={<Engine />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
        </BrowserRouter>
      )}
      <div
          className="fixed bottom-0 left-0 w-full pointer-events-none"
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
          className="fixed top-0 left-0 w-full h-full bg-black/40 pointer-events-none"
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
