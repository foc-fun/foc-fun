'use client';

import { Button } from '../ui';

const About = () => {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-5xl md:text-6xl mb-4 animate-fade-in">The Starknet App Engine</h1>
          <p className="text-xl text-muted max-w-3xl mx-auto animate-fade-in animate-delay-200">
            foc.fun is a platform for deploying and managing smart contracts on Starknet, 
            making blockchain gaming accessible to everyone.
          </p>
        </section>

        {/* What is foc.fun Section */}
        <section className="py-12 animate-fade-in">
          <h2 className="text-4xl text-center mb-8">What is foc.fun?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card hover-lift animate-fade-in">
              <div className="card-body">
                <h3 className="text-2xl mb-4">🎮 Gaming Platform</h3>
                <p className="text-muted">
                  A decentralized hub for blockchain games on Starknet. Play, build, and share 
                  games with the community in a trustless environment.
                </p>
              </div>
            </div>
            <div className="card hover-lift animate-fade-in animate-delay-100">
              <div className="card-body">
                <h3 className="text-2xl mb-4">🔧 Developer Tools</h3>
                <p className="text-muted">
                  Registry system for contract classes, automated deployment, and event indexing. 
                  Build games faster with our no-code contract interaction interface.
                </p>
              </div>
            </div>
            <div className="card hover-lift animate-fade-in animate-delay-200">
              <div className="card-body">
                <h3 className="text-2xl mb-4">⚡ Powered by Starknet</h3>
                <p className="text-muted">
                  Leverage Starknet&apos;s low fees and high performance. Your games run efficiently 
                  while maintaining full decentralization and security.
                </p>
              </div>
            </div>
            <div className="card hover-lift animate-fade-in animate-delay-300">
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
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4 p-6 bg-gray-50/5 rounded-lg border border-gray-200/10">
                <div className="flex-shrink-0 mt-1">
                  <span className="text-3xl">🚀</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl mb-2 font-bold">One-Click Deployment</h4>
                  <p className="text-muted text-base leading-relaxed">Deploy your game contracts instantly without complex setup</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-gray-50/5 rounded-lg border border-gray-200/10">
                <div className="flex-shrink-0 mt-1">
                  <span className="text-3xl">📊</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl mb-2 font-bold">Event Indexing</h4>
                  <p className="text-muted text-base leading-relaxed">Automatic blockchain event tracking and processing</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-gray-50/5 rounded-lg border border-gray-200/10">
                <div className="flex-shrink-0 mt-1">
                  <span className="text-3xl">🎨</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl mb-2 font-bold">No-Code Interface</h4>
                  <p className="text-muted text-base leading-relaxed">Interact with smart contracts through an intuitive UI</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-gray-50/5 rounded-lg border border-gray-200/10">
                <div className="flex-shrink-0 mt-1">
                  <span className="text-3xl">💰</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl mb-2 font-bold">Low Fees</h4>
                  <p className="text-muted text-base leading-relaxed">Enjoy Starknet&apos;s efficient architecture for minimal transaction costs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="py-12 animate-fade-in">
          <h2 className="text-4xl text-center mb-8">What&apos;s Coming</h2>
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <div className="card-body">
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold">Q1</div>
                      <div className="flex-1">
                        <h4 className="text-xl mb-2 text-black">Platform Launch</h4>
                        <p className="text-black">Core gaming platform with initial game collection</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold">Q2</div>
                      <div className="flex-1">
                        <h4 className="text-xl mb-2 text-black">Developer SDK</h4>
                        <p className="text-black">Complete toolkit for building games on foc.fun</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center text-white font-bold">Q3</div>
                      <div className="flex-1">
                        <h4 className="text-xl mb-2 text-black">Mobile Support</h4>
                        <p className="text-black">Play your favorite games on mobile devices</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">Q4</div>
                      <div className="flex-1">
                        <h4 className="text-xl mb-2 text-black">Tournaments & Rewards</h4>
                        <p className="text-black">Competitive gaming with on-chain rewards</p>
                      </div>
                    </div>
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