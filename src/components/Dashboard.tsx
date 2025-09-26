import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlayerCard } from "./PlayerCard";
import { TeamCard } from "./TeamCard";
import { AuctionInterface } from "./AuctionInterface";
import { UnsoldPlayersList } from "./UnsoldPlayersList";
import { useToast } from "@/hooks/use-toast";
import { Player, Team } from "@/types/auction";

// Sample data - In a real app, this would come from a backend
const initialPlayers: Player[] = [
  { id: "1", name: "ProGamer1", kdr: 2.5, classification: "Pro", contact: "pro1@email.com", status: "available", registered: true },
  { id: "2", name: "NoobPlayer1", kdr: 1.2, classification: "Noob", contact: "noob1@email.com", status: "available", registered: true },
  { id: "3", name: "EliteShooter", kdr: 3.1, classification: "Pro", contact: "elite@email.com", status: "available", registered: false },
  { id: "4", name: "CasualGamer", kdr: 0.8, classification: "Noob", contact: "casual@email.com", status: "available", registered: false },
  { id: "5", name: "TopFrag", kdr: 2.8, classification: "Pro", contact: "topfrag@email.com", status: "available", registered: true },
];

const initialTeams: Team[] = [
  { 
    id: "t1", 
    name: "Thunder Bolts", 
    contact: "thunder@email.com", 
    credits: 110, 
    initialCredits: 110,
    roster: { pro: [], noob: [] }
  },
  { 
    id: "t2", 
    name: "Lightning Strike", 
    contact: "lightning@email.com", 
    credits: 110, 
    initialCredits: 110,
    roster: { pro: [], noob: [] }
  },
  { 
    id: "t3", 
    name: "Storm Riders", 
    contact: "storm@email.com", 
    credits: 110, 
    initialCredits: 110,
    roster: { pro: [], noob: [] }
  },
];

interface DashboardProps {
  players: Player[];
  teams: Team[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

export const Dashboard = ({ players, teams, setPlayers, setTeams }: DashboardProps) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isAuctionActive, setIsAuctionActive] = useState(false);
  const [auctionRound, setAuctionRound] = useState(1);
  const [selectedUnsoldPlayers, setSelectedUnsoldPlayers] = useState<string[]>([]);
  const { toast } = useToast();

  const availablePlayers = auctionRound === 1 
    ? players.filter(p => p.status === 'available' && p.registered)
    : players.filter(p => p.status === 'available' && p.registered && selectedUnsoldPlayers.includes(p.id));
  const unsoldPlayers = players.filter(p => p.status === 'unsold');
  const currentPlayer = isAuctionActive && availablePlayers.length > 0 ? availablePlayers[currentPlayerIndex] : null;

  const handleStartAuction = () => {
    if (availablePlayers.length === 0) {
      toast({
        title: "No Players Available",
        description: "All players have been processed.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAuctionActive(true);
    setCurrentPlayerIndex(0);
    toast({
      title: "Auction Started!",
      description: `Round ${auctionRound} auction is now active.`,
    });
  };

  const handleConfirmSale = (playerId: string, teamId: string, amount: number) => {
    const player = players.find(p => p.id === playerId);
    const team = teams.find(t => t.id === teamId);
    
    if (!player || !team) return;

    // Update player
    setPlayers(prev => prev.map(p => 
      p.id === playerId 
        ? { ...p, status: 'sold' as const, team: team.name, currentBid: amount }
        : p
    ));

    // Update team
    setTeams(prev => prev.map(t => 
      t.id === teamId 
        ? {
            ...t,
            credits: t.credits - amount,
            roster: {
              ...t.roster,
              [player.classification.toLowerCase()]: [
                ...t.roster[player.classification.toLowerCase() as 'pro' | 'noob'],
                player.name
              ]
            }
          }
        : t
    ));
  };

  const handleMarkUnsold = (playerId: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId 
        ? { ...p, status: 'unsold' as const }
        : p
    ));
  };

  const handleNextPlayer = () => {
    const nextIndex = currentPlayerIndex + 1;
    if (nextIndex >= availablePlayers.length) {
      // End of round
      setIsAuctionActive(false);
      setCurrentPlayerIndex(0);
      
      const unsoldPlayers = players.filter(p => p.status === 'unsold');
      if (unsoldPlayers.length > 0 && auctionRound === 1) {
        toast({
          title: "Round 1 Complete",
          description: "Starting Round 2 for unsold players.",
        });
        setAuctionRound(2);
        // Move unsold players back to available for round 2
        setPlayers(prev => prev.map(p => 
          p.status === 'unsold' ? { ...p, status: 'available' } : p
        ));
      } else {
        toast({
          title: "Auction Complete!",
          description: "All rounds finished. Ready to export results.",
        });
      }
    } else {
      setCurrentPlayerIndex(nextIndex);
    }
  };

  const exportResults = () => {
    const soldPlayers = players.filter(p => p.status === 'sold');
    const csvContent = [
      "Player Name,Team,Final Bid,Classification",
      ...soldPlayers.map(p => `${p.name},${p.team || 'Unknown'},${p.currentBid || 0},${p.classification}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'auction_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Results Exported",
      description: "Auction results have been downloaded as CSV.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Smash Kart E-Sports Auction
          </h1>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Round {auctionRound}
            </Badge>
            {isAuctionActive && (
              <Badge variant="default" className="text-lg px-4 py-2 bg-accent text-accent-foreground animate-glow-pulse">
                LIVE AUCTION
              </Badge>
            )}
          </div>
        </div>

        {/* Control Panel */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Auction Control</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button 
              variant="gaming" 
              size="lg"
              onClick={handleStartAuction}
              disabled={isAuctionActive || availablePlayers.length === 0}
            >
              {isAuctionActive ? "Auction Active" : "Start Auction"}
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={exportResults}
            >
              Export Results
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Available Players: {availablePlayers.length}</span>
              <span>•</span>
              <span>Sold: {players.filter(p => p.status === 'sold').length}</span>
              <span>•</span>
              <span>Unsold: {players.filter(p => p.status === 'unsold').length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Auction Interface */}
          <div className="lg:col-span-2">
            <AuctionInterface
              currentPlayer={currentPlayer}
              teams={teams}
              onConfirmSale={handleConfirmSale}
              onMarkUnsold={handleMarkUnsold}
              onNextPlayer={handleNextPlayer}
            />
          </div>

          {/* Teams Overview */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Teams</h3>
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>

        {/* Unsold Players Section for Round 2 */}
        {auctionRound === 2 && unsoldPlayers.length > 0 && (
          <UnsoldPlayersList
            unsoldPlayers={unsoldPlayers}
            onSelectPlayerForRound2={(playerId) => {
              setSelectedUnsoldPlayers(prev => 
                prev.includes(playerId) 
                  ? prev.filter(id => id !== playerId)
                  : [...prev, playerId]
              );
            }}
            selectedPlayers={selectedUnsoldPlayers}
          />
        )}

        {/* Detailed View */}
        <Tabs defaultValue="players" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="players">All Players</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="unsold">Unsold</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="players" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {players.map((player) => (
                <PlayerCard 
                  key={player.id} 
                  player={player}
                  isAuctionActive={false}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availablePlayers.map((player) => (
                <PlayerCard 
                  key={player.id} 
                  player={player}
                  isAuctionActive={isAuctionActive}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="unsold" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {unsoldPlayers.map((player) => (
                <PlayerCard 
                  key={player.id} 
                  player={player}
                  isAuctionActive={false}
                />
              ))}
            </div>
            {unsoldPlayers.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No unsold players yet
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};