import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gavel, Users, Trophy, Zap, GamepadIcon, Target } from "lucide-react";

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage = ({ onEnterApp }: LandingPageProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Gavel className="h-8 w-8" />,
      title: "Live Auctions",
      description: "Real-time bidding with instant updates"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Management",
      description: "Complete roster and credit tracking"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Pro & Noob Classification",
      description: "Smart player categorization by KDR"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out'
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-2xl animate-bounce-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-2xl animate-float" />
      </div>

      {/* Floating Gaming Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <GamepadIcon className="absolute top-1/4 left-1/6 h-12 w-12 text-primary/30 animate-float-delayed" />
        <Target className="absolute top-3/4 right-1/6 h-16 w-16 text-accent/40 animate-spin-slow" />
        <Zap className="absolute bottom-1/3 left-1/3 h-10 w-10 text-secondary/50 animate-bounce-slow" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo/Title with 3D Effect */}
          <div className="transform-gpu perspective-1000">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-glow-pulse transform-3d">
              SMASH KART
            </h1>
            <div className="text-2xl md:text-4xl font-semibold text-primary mt-4 animate-slide-up">
              E-SPORTS AUCTION
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-delayed">
            Build your ultimate gaming team through live auctions. 
            <span className="text-primary font-semibold"> Bid smart, win big!</span>
          </p>

          {/* 3D Action Button */}
          <div className="pt-8">
            <Button
              onClick={onEnterApp}
              size="lg"
              className="text-xl px-12 py-6 bg-gradient-primary hover:scale-105 transform transition-all duration-300 shadow-glow animate-bounce-subtle"
            >
              <Gavel className="mr-3 h-6 w-6" />
              Start Auction
            </Button>
          </div>
        </div>

        {/* Features Grid with 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-glow transform-gpu group"
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-8 mt-16 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary animate-number-counter">110</div>
            <div className="text-sm text-muted-foreground">Credits per Team</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-accent animate-number-counter">5</div>
            <div className="text-sm text-muted-foreground">Players per Team</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-secondary animate-number-counter">2</div>
            <div className="text-sm text-muted-foreground">Auction Rounds</div>
          </div>
        </div>
      </div>
    </div>
  );
};