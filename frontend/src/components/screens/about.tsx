'use client';

import { Button } from '../ui';

const About = () => {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-5xl md:text-6xl mb-4 animate-bounce-in">The Starknet App Engine</h1>
          <p className="text-xl text-muted max-w-3xl mx-auto animate-fade-in-up animate-delay-300">
            foc.fun is a platform for deploying and managing smart contracts on Starknet, 
            making blockchain gaming accessible to everyone.
          </p>
        </section>

        {/* What is foc.fun Section */}
        <section className="py-12 animate-fade-in">
          <h2 className="text-4xl text-center mb-8">What is foc.fun?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card hover-lift animate-slide-in-left">
              <div className="card-body">
                <h3 className="text-2xl mb-4">🎮 Gaming Platform</h3>
                <p className="text-muted">
                  A decentralized hub for blockchain games on Starknet. Play, build, and share 
                  games with the community in a trustless environment.
                </p>
              </div>
            </div>
            <div className="card hover-lift animate-slide-in-right">
              <div className="card-body">
                <h3 className="text-2xl mb-4">🔧 Developer Tools</h3>
                <p className="text-muted">
                  Registry system for contract classes, automated deployment, and event indexing. 
                  Build games faster with our no-code contract interaction interface.
                </p>
              </div>
            </div>
            <div className="card hover-lift animate-slide-in-left animate-delay-200">
              <div className="card-body">
                <h3 className="text-2xl mb-4">⚡ Powered by Starknet</h3>
                <p className="text-muted">
                  Leverage Starknet&apos;s low fees and high performance. Your games run efficiently 
                  while maintaining full decentralization and security.
                </p>
              </div>
            </div>
            <div className="card hover-lift animate-slide-in-right animate-delay-200">
              <div className="card-body">
                <h3 className="text-2xl mb-4">👥 Community Driven</h3>
                <p className="text-muted">
                  Open source and community-focused. Contribute to the platform, create your own 
                  games, and help shape the future of blockchain gaming.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-12 animate-fade-in">
          <h2 className="text-4xl text-center mb-8">Key Features</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🚀</span>
                <div>
                  <h4 className="text-xl mb-2">One-Click Deployment</h4>
                  <p className="text-muted">Deploy your game contracts instantly without complex setup</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">📊</span>
                <div>
                  <h4 className="text-xl mb-2">Event Indexing</h4>
                  <p className="text-muted">Automatic blockchain event tracking and processing</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">🎨</span>
                <div>
                  <h4 className="text-xl mb-2">No-Code Interface</h4>
                  <p className="text-muted">Interact with smart contracts through an intuitive UI</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">💰</span>
                <div>
                  <h4 className="text-xl mb-2">Low Fees</h4>
                  <p className="text-muted">Enjoy Starknet&apos;s efficient architecture for minimal transaction costs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="py-12 animate-fade-in">
          <h2 className="text-4xl text-center mb-8">What&apos;s Coming</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold">Q1</div>
                  <div className="flex-1">
                    <h4 className="text-xl mb-2">Platform Launch</h4>
                    <p className="text-muted">Core gaming platform with initial game collection</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold">Q2</div>
                  <div className="flex-1">
                    <h4 className="text-xl mb-2">Developer SDK</h4>
                    <p className="text-muted">Complete toolkit for building games on foc.fun</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center text-white font-bold">Q3</div>
                  <div className="flex-1">
                    <h4 className="text-xl mb-2">Mobile Support</h4>
                    <p className="text-muted">Play your favorite games on mobile devices</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">Q4</div>
                  <div className="flex-1">
                    <h4 className="text-xl mb-2">Tournaments & Rewards</h4>
                    <p className="text-muted">Competitive gaming with on-chain rewards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-12 text-center animate-fade-in">
          <h2 className="text-4xl mb-8">Join the Community</h2>
          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
            Be part of the future of blockchain gaming. Connect with developers, 
            players, and creators building on foc.fun.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://github.com/foc-fun" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <span>GitHub</span>
              </Button>
            </a>
            <a href="https://discord.gg/focfun" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <span>Discord</span>
              </Button>
            </a>
            <a href="https://twitter.com/focfun" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <span>Twitter</span>
              </Button>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;