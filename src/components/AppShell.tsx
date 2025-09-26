import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Gavel, Settings, Home } from "lucide-react";
import { Dashboard } from "./Dashboard";
import { RegistrationDashboard } from "./RegistrationDashboard";
import { LandingPage } from "./LandingPage";
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
    captain: "Captain Thunder", 
    credits: 110, 
    initialCredits: 110,
    roster: { pro: [], noob: [] },
    teamSize: 5
  },
  { 
    id: "t2", 
    name: "Lightning Strike", 
    contact: "lightning@email.com", 
    captain: "Captain Lightning", 
    credits: 110, 
    initialCredits: 110,
    roster: { pro: [], noob: [] },
    teamSize: 5
  },
  { 
    id: "t3", 
    name: "Storm Riders", 
    contact: "storm@email.com", 
    captain: "Captain Storm", 
    credits: 110, 
    initialCredits: 110,
    roster: { pro: [], noob: [] },
    teamSize: 5
  },
];

type View = 'landing' | 'registration' | 'auction';

export const AppShell = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [players, setPlayers] = useState(initialPlayers);
  const [teams, setTeams] = useState(initialTeams);

  // Player management functions
  const handleAddPlayer = (playerData: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: Date.now().toString(),
    };
    setPlayers(prev => [...prev, newPlayer]);
  };

  const handleDeletePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const handleTogglePlayerRegistration = (playerId: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, registered: !p.registered } : p
    ));
  };

  // Team management functions
  const handleAddTeam = (teamData: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...teamData,
      id: Date.now().toString(),
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  if (currentView === 'landing') {
    return <LandingPage onEnterApp={() => setCurrentView('registration')} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Auction Manager
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentView('landing')}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button
                variant={currentView === 'registration' ? 'gaming' : 'outline'}
                onClick={() => setCurrentView('registration')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Registration
              </Button>
              <Button
                variant={currentView === 'auction' ? 'gaming' : 'outline'}
                onClick={() => setCurrentView('auction')}
                className="flex items-center gap-2"
              >
                <Gavel className="h-4 w-4" />
                Auction
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {currentView === 'registration' ? (
        <RegistrationDashboard
          players={players}
          teams={teams}
          onAddPlayer={handleAddPlayer}
          onDeletePlayer={handleDeletePlayer}
          onTogglePlayerRegistration={handleTogglePlayerRegistration}
          onAddTeam={handleAddTeam}
          onDeleteTeam={handleDeleteTeam}
        />
      ) : (
        <Dashboard
          players={players}
          teams={teams}
          setPlayers={setPlayers}
          setTeams={setTeams}
        />
      )}
    </div>
  );
};