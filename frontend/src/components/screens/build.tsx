'use client';

import { Button, Card, CardBody } from '../ui';

const Build = () => {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container">
        {/* Hero Section */}
        <section className="text-center py-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl mb-4">Build on foc.fun</h1>
          <p className="text-xl text-muted max-w-3xl mx-auto mb-8">
            Create the next generation of blockchain games on Starknet. 
            Our platform provides everything you need to build, deploy, and scale your game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://docs.foc.fun" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">
                View Documentation
                <span className="ml-1">→</span>
              </Button>
            </a>
            <a href="https://github.com/foc-fun/foc-fun" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                GitHub Repository
                <span className="ml-1">↗</span>
              </Button>
            </a>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-12 animate-fade-in">
          <h2 className="text-4xl text-center mb-12">Why Build on foc.fun?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardBody className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl mb-3">Lightning Fast</h3>
                <p className="text-muted">
                  Deploy your game in minutes, not hours. Our streamlined process gets you from code to live game quickly.
                </p>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl mb-3">Low Cost</h3>
                <p className="text-muted">
                  Benefit from Starknet&apos;s efficient architecture. Lower gas fees mean more players can afford to play.
                </p>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl mb-3">Secure & Trustless</h3>
                <p className="text-muted">
                  Built on Starknet&apos;s proven infrastructure. Your game logic is transparent and verifiable.
                </p>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="text-center">
                <div className="text-4xl mb-4">🛠️</div>
                <h3 className="text-xl mb-3">Developer Friendly</h3>
                <p className="text-muted">
                  Comprehensive SDK, detailed docs, and active community support to help you succeed.
                </p>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl mb-3">Built-in Analytics</h3>
                <p className="text-muted">
                  Track player behavior, game economics, and performance with our integrated analytics.
                </p>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl mb-3">Global Reach</h3>
                <p className="text-muted">
                  Access a worldwide player base. No geographical restrictions or payment barriers.
                </p>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="py-12 animate-fade-in">
          <h2 className="text-4xl text-center mb-12">Quick Start Guide</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xl mb-2">Set Up Your Environment</h4>
                  <p className="text-muted mb-3">
                    Install Foc Engine and clone the starter template.
                  </p>
                  <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm mb-3">
                    <code>asdf plugin add foc-engine https://github.com/foc-fun/asdf-foc-engine.git</code>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm mb-3">
                    <code>asdf install foc-engine latest</code>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm">
                    <code>git clone https://github.com/foc-fun/game-template.git</code>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xl mb-2">Write Your Game Logic</h4>
                  <p className="text-muted mb-3">
                    Edit contracts and game logic using Cairo. Create a custom frontend. And use the engine to run.
                  </p>
                  <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm">
                    <code>foc-engine run</code>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-tertiary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xl mb-2">Deploy to foc.fun</h4>
                  <p className="text-muted mb-3">
                    Register your contract with our platform and deploy to Starknet mainnet or testnet.
                  </p>
                  <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm">
                    <code>foc-engine deploy --network sepolia</code>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="text-xl mb-2">Launch & Promote</h4>
                  <p className="text-muted">
                    Your game appears on the foc.fun platform automatically. Share with the community and start growing your player base.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Games */}
        <section className="py-12 animate-fade-in">
          <h2 className="text-4xl text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardBody>
                <h3 className="text-2xl mb-3">art/peace</h3>
                <p className="text-muted mb-4">
                  Collaborative pixel art game with 10,000+ daily active users. 
                  Built in 2 weeks using foc.fun&apos;s rapid deployment tools.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Code
                  </Button>
                  <Button variant="ghost" size="sm">
                    Play Game
                  </Button>
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <h3 className="text-2xl mb-3">Cryptle</h3>
                <p className="text-muted mb-4">
                  Daily word puzzle game with NFT rewards. 
                  Demonstrates how to integrate tokens and achievements.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Code
                  </Button>
                  <Button variant="ghost" size="sm">
                    Coming Soon
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Resources */}
        <section className="py-12 animate-fade-in">
          <h2 className="text-4xl text-center mb-12">Developer Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <a href="https://docs.foc.fun" target="_blank" rel="noopener noreferrer">
              <Card className="text-center hover:scale-105 transition-transform">
                <CardBody>
                  <div className="text-3xl mb-2">📚</div>
                  <h4 className="font-bold">Docs</h4>
                </CardBody>
              </Card>
            </a>
            
            <a href="https://github.com/foc-fun/examples" target="_blank" rel="noopener noreferrer">
              <Card className="text-center hover:scale-105 transition-transform">
                <CardBody>
                  <div className="text-3xl mb-2">💻</div>
                  <h4 className="font-bold">Examples</h4>
                </CardBody>
              </Card>
            </a>
            
            <a href="https://discord.gg/focfun" target="_blank" rel="noopener noreferrer">
              <Card className="text-center hover:scale-105 transition-transform">
                <CardBody>
                  <div className="text-3xl mb-2">💬</div>
                  <h4 className="font-bold">Discord</h4>
                </CardBody>
              </Card>
            </a>
            
            <a href="https://docs.foc.fun/api" target="_blank" rel="noopener noreferrer">
              <Card className="text-center hover:scale-105 transition-transform">
                <CardBody>
                  <div className="text-3xl mb-2">🔌</div>
                  <h4 className="font-bold">API</h4>
                </CardBody>
              </Card>
            </a>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center animate-fade-in">
          <Card className="max-w-3xl mx-auto">
            <CardBody>
              <h2 className="text-3xl mb-4">Ready to Build?</h2>
              <p className="text-muted mb-6">
                Join hundreds of developers already building the future of gaming on Starknet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://docs.foc.fun/quickstart" target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="lg">
                    Get Started Now
                  </Button>
                </a>
                <a href="mailto:developers@foc.fun">
                  <Button variant="outline" size="lg">
                    Contact Support
                  </Button>
                </a>
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Build;
