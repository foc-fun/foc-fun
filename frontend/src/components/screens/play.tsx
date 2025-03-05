'use client';

import Image from 'next/image';

const Play = () => {
  const projects = [
      {
          "name": "art/peace",
          "description": "Competitive & Collaborative Art Experiment",
          "url": "https://art-peace.net",
          "genre": "game",
          "tags": ["game", "fun"],
          "image": "/art-peace/preview.png",
          "video": "/art-peace/preview.mp4",
          "status": "new",
      },
      {
          "name": "click.meme",
          "description": "memecoins go brrrr...",
          "url": "https://foc.fun/stonks",
          "genre": "game",
          "tags": ["game", "fun"],
          "image": "/stonks/preview.png",
          "video": "/stonks/preview.mp4",
          "status": "coming sooner...",
      },
      {
          "name": "Chimera",
          "description": "Merge the elements, build the universe.",
          "url": "https://foc.fun/chimera",
          "genre": "game",
          "tags": ["game", "fun"],
          "image": "/chimera/preview.png",
          "video": "/chimera/preview.mp4",
          "status": "coming sooner...",
      },
      {
          "name": "Cryptle",
          "description": "Daily word puzzles.",
          "url": "https://foc.fun/cryptle",
          "genre": "daily",
          "tags": ["word", "puzzle", "daily"],
          "image": "/cryptle/preview.png",
          "video": "/cryptle/preview.mp4",
          "status": "coming sooner...",
      },
      {
          "name": "Puppet Pals",
          "description": "Your friendly auto-battler.",
          "url": "https://foc.fun/puppet-pals",
          "genre": "game",
          "tags": ["game", "fun", "auto"],
          "image": "/default/preview.png",
          "video": "/default/preview.mp4",
          "status": "coming soon...",
      },
      {
          // Sudoku, Crossword, Word Search, etc.
          "name": "The Daily Paper",
          "description": "The fun part of the news!",
          "url": "https://foc.fun/daily-paper",
          "genre": "daily",
          "tags": ["puzzles", "daily"],
          "image": "/daily-paper/preview.png",
          "video": "/daily-paper/preview.mp4",
          "status": "coming soon...",
      },
      {
          "name": "Foc Farm",
          "description": "Collect rare breeds.",
          "url": "https://foc.fun/foc-farm",
          "genre": "game",
          "tags": ["game", "fun"],
          "image": "/default/preview.png",
          "video": "/default/preview.mp4",
          "status": "coming soon...",
      },
      {
          "name": "War of the Pixels",
          "description": "Risk-like pixel battler.",
          "url": "https://foc.fun/war-of-the-pixels",
          "genre": "game",
          "tags": ["game", "fun", "strategy"],
          "image": "/default/preview.png",
          "video": "/default/preview.mp4",
          "status": "coming later...",
      },
      {
          "name": "MC Economy",
          "description": "Minecraft <> Starknet Economy Server",
          "url": "https://foc.fun/mc-economy",
          "genre": "game",
          "tags": ["game", "fun", "minecraft", "mod"],
          "image": "/default/preview.png",
          "video": "/default/preview.mp4",
          "status": "coming later...",
      },
      {
          "name": "Gacha Go",
          "description": "Gacha with a twist.",
          "url": "https://foc.fun/gacha-go",
          "genre": "game",
          "tags": ["game", "fun", "gambling"],
          "image": "/default/preview.png",
          "video": "/default/preview.mp4",
          "status": "coming later...",
      },
      {
          "name": "Foc Chat",
          "description": "A chat app.",
          "url": "https://foc.fun/foc-chat",
          "genre": "social",
          "tags": ["social", "chat"],
          "image": "/default/preview.png",
          "video": "/default/preview.mp4",
          "status": "coming later...",
      }
  ];

  return (
    <div className="w-full flex flex-row justify-center mt-[12rem] pb-[4rem]">
      <div className="grid grid-cols-1 gap-[2rem] sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 p-0 rounded-lg transition-all duration-300 bg-[#00000000] w-[30rem]"
              >
              <a
                  href={project.url}
                  style={{ width: "300px" }}
                  className="drop-shadow-md hover:drop-shadow-xl shadow-black border-2 border-slate-900 rounded-lg hover:transform hover:scale-[1.03] transition-transform duration-200 bg-slate-900 relative"
              >
              <div
                  style={{ display: `${project.status === "new" ? "block" : "none"}`, zIndex: 4 }}
                  className="absolute top-[-10px] right-[-10px] p-1 pt-1.5 pl-1.5 text-[1.4rem] font-bold text-white bg-red-500 rounded-lg drop-shadow-lg animate-bounce"
              >
                  new!
              </div>
              <div className="relative w-full h-[20rem]">
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
                  <div style={{ display: `${project.status.startsWith("coming") ? "block" : "none"}` }} className="absolute flex items-center justify-center bg-black bg-opacity-70 w-full h-full rounded-lg text-[4rem]">
                      <p className="text-slate-250 text-center pt-[20%]">{project.status}</p>
                  </div>
              </div>
              </a>
              <div className="flex flex-col gap-0 pl-2 text-slate-200">
                  <h2 className="text-[2rem] font-bold">{project.name}</h2>
                  <p className="text-[1.4rem] text-wrap">{project.description}</p>
              </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default Play;
