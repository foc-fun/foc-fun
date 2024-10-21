import Image from "next/image";
import localFont from '@next/font/local'

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

export default function Home() {
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
          "name": "Amalgam",
          "description": "Merge the elements, build the universe",
          "url": "https://foc.fun/amalgam",
          "genre": "game",
          "tags": ["game", "fun"],
          "image": "/amalgam/preview.png",
          "video": "/amalgam/preview.mp4",
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
    <div className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-0 gap-8 ${pixelsFont.variable} font-sans`}>
      <div
          className="fixed bottom-0 left-0 w-full"
          style={{ zIndex: -2 }}
      >
          <Image
              src="/background/bottom.png"
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
                <div key={{index}} className="flex flex-col gap-2 p-0 rounded-lg transition-all duration-300 bg-[#00000000]">
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
                <div className="relative w-full h-48">
                    <video
                        className="absolute w-full h-full object-cover rounded-lg"
                        autoPlay
                        loop
                        muted
                        playsInline
                        src={project.video}
                    />
                    <img
                        className="absolute w-full h-full object-cover rounded-lg"
                        style={{ imageRendering: "pixelated" }}
                        src={project.image}
                        alt={project.name}
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
