'use client';

import { useState, useEffect } from 'react';
import { Card, CardMedia, CardBody, Badge, Button, LoadingCard } from '../ui';

const Play = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading time for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
          "playerCount": "12.5K",
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
          "playerCount": "8.2K",
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
          "playerCount": "4.7K",
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
          "playerCount": "2.1K",
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
          "playerCount": "1.8K",
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
          "playerCount": "3.4K",
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
          "playerCount": "950",
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
          "playerCount": "650",
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
          "playerCount": "1.2K",
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
          "playerCount": "520",
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
          "playerCount": "780",
      }
  ];

  // Filter and search logic
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || project.genre === selectedGenre;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => project.tags.includes(tag));
    
    return matchesSearch && matchesGenre && matchesTags;
  });

  const genres = ['all', ...new Set(projects.map(p => p.genre))];
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags))).sort();
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getBadgeVariant = (status: string) => {
    if (status === 'new') return 'new';
    if (status.includes('sooner')) return 'warning';
    if (status.includes('soon')) return 'primary';
    return 'primary';
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-5xl md:text-6xl mb-4 animate-fade-in-up">Play & Discover</h1>
          <p className="text-xl text-muted max-w-3xl mx-auto mb-8 animate-fade-in animate-delay-200">
            Explore the future of blockchain gaming on Starknet. From art experiments to strategy games, 
            discover unique experiences built by the community.
          </p>
          
          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-8 animate-slide-in-left animate-delay-300">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input flex-1 hover-glow"
                />
                <select 
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="input sm:w-auto hover-glow"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>
                      {genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Tag Filters */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-pixel text-muted">Filter by tags:</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-2 rounded-lg font-vt323 text-sm transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-white'
                          : 'bg-gray-200/10 text-foreground hover:bg-gray-200/20'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  {selectedTags.length > 0 && (
                    <button
                      onClick={() => setSelectedTags([])}
                      className="px-3 py-2 rounded-lg font-vt323 text-sm bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Games Grid */}
        <section className="animate-fade-in overflow-visible">
          {error ? (
            <div className="text-center py-12">
              <h3 className="text-2xl mb-4 text-red-500">Oops! Something went wrong</h3>
              <p className="text-muted mb-6">{error}</p>
              <Button 
                variant="primary" 
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 1000);
                }}
              >
                Try Again
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <LoadingCard count={6} />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl mb-4">No games found</h3>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible p-4">
              {filteredProjects.map((project, index) => (
                <Card 
                  key={index} 
                  className={`group cursor-pointer hover-lift animate-scale-in animate-delay-${Math.min(index * 100 + 100, 500)} overflow-visible`}
                  onClick={() => window.open(project.url, '_blank')}
                >
                  <div className="relative overflow-visible">
                    <CardMedia
                      src={project.image}
                      videoSrc={project.video}
                      alt={project.name}
                      imageRendering="pixelated"
                      overlay={
                        project.status.startsWith("coming") ? (
                          <div className="bg-black/70 inset-0 absolute flex items-center justify-center">
                            <p className="text-white text-2xl text-center font-bold">
                              {project.status}
                            </p>
                          </div>
                        ) : null
                      }
                    />
                    {project.status === 'new' && (
                      <div className="absolute -top-3 -right-3 z-10">
                        <Badge variant="new">new!</Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardBody>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={getBadgeVariant(project.status)}>
                          {project.genre}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted">
                          <span>👥</span>
                          <span>{project.playerCount}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-3 py-1.5 bg-gray-200/10 rounded text-sm font-vt323"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button 
                      variant={project.status.startsWith("coming") ? "outline" : "primary"}
                      size="sm"
                      fullWidth
                      disabled={project.status.startsWith("coming")}
                    >
                      {project.status.startsWith("coming") ? "Coming Soon" : "Play Now"}
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Featured Section */}
        <section className="py-12 mt-12 animate-fade-in">
          <h2 className="text-4xl text-center mb-8">Featured Game</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative w-full aspect-square md:aspect-auto md:h-full flex items-center justify-center overflow-hidden rounded-xl md:rounded-none md:rounded-l-xl">
                  <CardMedia
                    src="/art-peace/preview.png"
                    videoSrc="/art-peace/preview.mp4"
                    alt="art/peace"
                    imageRendering="pixelated"
                  />
                </div>
                <CardBody className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-3xl font-bold">art/peace</h3>
                    <Badge variant="new">featured</Badge>
                  </div>
                  <p className="text-muted mb-6">
                    A groundbreaking collaborative art experiment where thousands of players 
                    work together to create pixel art on a shared canvas. Every pixel placed 
                    is recorded on the Starknet blockchain.
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      variant="primary"
                      onClick={() => window.open('https://art-peace.net', '_blank')}
                    >
                      Play Now
                    </Button>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </CardBody>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Play;
