'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card, CardMedia, CardBody, Badge, Button } from '../ui';

const Play = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

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

  // Filter and search logic
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || project.genre === selectedGenre;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const genres = ['all', ...new Set(projects.map(p => p.genre))];
  const statuses = ['all', ...new Set(projects.map(p => p.status))];

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
        <section className="text-center py-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl mb-4">Play & Discover</h1>
          <p className="text-xl text-muted max-w-3xl mx-auto mb-8">
            Explore the future of blockchain gaming on Starknet. From art experiments to strategy games, 
            discover unique experiences built by the community.
          </p>
          
          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input flex-1"
              />
              <select 
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="input sm:w-auto"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input sm:w-auto"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Games Grid */}
        <section className="animate-fade-in">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl mb-4">No games found</h3>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <Card 
                  key={index} 
                  className="group cursor-pointer"
                  onClick={() => window.open(project.url, '_blank')}
                >
                  <div className="relative">
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
                      <div className="absolute -top-2 -right-2 z-10">
                        <Badge variant="new">new!</Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardBody>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <Badge variant={getBadgeVariant(project.status)}>
                        {project.genre}
                      </Badge>
                    </div>
                    <p className="text-muted mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-200/10 rounded text-xs"
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
                <CardMedia
                  src="/art-peace/preview.png"
                  videoSrc="/art-peace/preview.mp4"
                  alt="art/peace"
                  imageRendering="pixelated"
                />
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
