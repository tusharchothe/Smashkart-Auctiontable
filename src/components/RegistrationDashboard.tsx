import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Player, Team } from "@/types/auction";

interface RegistrationDashboardProps {
  players: Player[];
  teams: Team[];
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
  onDeletePlayer: (playerId: string) => void;
  onTogglePlayerRegistration: (playerId: string) => void;
  onAddTeam: (team: Omit<Team, 'id'>) => void;
  onDeleteTeam: (teamId: string) => void;
}

export const RegistrationDashboard = ({
  players,
  teams,
  onAddPlayer,
  onDeletePlayer,
  onTogglePlayerRegistration,
  onAddTeam,
  onDeleteTeam,
}: RegistrationDashboardProps) => {
  const [playerForm, setPlayerForm] = useState({
    name: "",
    kdr: "",
    contact: "",
  });
  
  const [teamForm, setTeamForm] = useState({
    name: "",
    contact: "",
    captain: "",
    teamSize: 5,
  });

  const { toast } = useToast();

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerForm.name || !playerForm.kdr || !playerForm.contact) {
      toast({
        title: "Missing Information",
        description: "Please fill in all player fields.",
        variant: "destructive",
      });
      return;
    }

    const kdr = parseFloat(playerForm.kdr);
    if (isNaN(kdr) || kdr < 0) {
      toast({
        title: "Invalid KDR",
        description: "Please enter a valid KDR value.",
        variant: "destructive",
      });
      return;
    }

    const classification = kdr >= 2.0 ? 'Pro' : 'Noob';
    
    onAddPlayer({
      name: playerForm.name,
      kdr,
      classification,
      contact: playerForm.contact,
      status: 'available',
      registered: false,
    });

    setPlayerForm({ name: "", kdr: "", contact: "" });
    
    toast({
      title: "Player Added",
      description: `${playerForm.name} has been added as a ${classification} player.`,
    });
  };

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.contact || !teamForm.captain || !teamForm.teamSize) {
      toast({
        title: "Missing Information",
        description: "Please fill in all team fields.",
        variant: "destructive",
      });
      return;
    }
    onAddTeam({
      name: teamForm.name,
      contact: teamForm.contact,
      captain: teamForm.captain,
      credits: 110,
      initialCredits: 110,
      roster: { pro: [], noob: [] },
      teamSize: Number(teamForm.teamSize),
    });
    setTeamForm({ name: "", contact: "", captain: "", teamSize: 5 });
    toast({
      title: "Team Added",
      description: `${teamForm.name} has been registered.`,
    });
  };

  const registeredPlayers = players.filter(p => p.registered);
  const unregisteredPlayers = players.filter(p => !p.registered);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Registration Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage players and teams before the auction
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{players.length}</div>
              <div className="text-sm text-muted-foreground">Total Players</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-accent">{registeredPlayers.length}</div>
              <div className="text-sm text-muted-foreground">Registered Players</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{teams.length}</div>
              <div className="text-sm text-muted-foreground">Total Teams</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-accent">
                {players.filter(p => p.classification === 'Pro').length}/{players.filter(p => p.classification === 'Noob').length}
              </div>
              <div className="text-sm text-muted-foreground">Pro/Noob Split</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="players" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="players">Player Management</TabsTrigger>
            <TabsTrigger value="teams">Team Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="players" className="space-y-6">
            {/* Add Player Form */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Add New Player
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPlayer} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="playerName">Player Name</Label>
                    <Input
                      id="playerName"
                      value={playerForm.name}
                      onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
                      placeholder="Enter player name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="playerKdr">KDR</Label>
                    <Input
                      id="playerKdr"
                      type="number"
                      step="0.1"
                      value={playerForm.kdr}
                      onChange={(e) => setPlayerForm({ ...playerForm, kdr: e.target.value })}
                      placeholder="e.g., 2.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="playerContact">Contact</Label>
                    <Input
                      id="playerContact"
                      value={playerForm.contact}
                      onChange={(e) => setPlayerForm({ ...playerForm, contact: e.target.value })}
                      placeholder="Email or phone"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" variant="gaming" className="w-full">
                      Add Player
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Players List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Unregistered Players */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle>Unregistered Players ({unregisteredPlayers.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {unregisteredPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{player.name}</span>
                          <Badge variant={player.classification === 'Pro' ? 'default' : 'secondary'}>
                            {player.classification}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          KDR: {player.kdr} • {player.contact}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="gaming"
                          onClick={() => onTogglePlayerRegistration(player.id)}
                        >
                          Register
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDeletePlayer(player.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {unregisteredPlayers.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No unregistered players
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Registered Players */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle>Registered Players ({registeredPlayers.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {registeredPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-accent/20">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{player.name}</span>
                          <Badge variant={player.classification === 'Pro' ? 'default' : 'secondary'}>
                            {player.classification}
                          </Badge>
                          <Badge variant="outline" className="text-accent border-accent">
                            Registered
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          KDR: {player.kdr} • {player.contact}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onTogglePlayerRegistration(player.id)}
                        >
                          Unregister
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDeletePlayer(player.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {registeredPlayers.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No registered players yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="teams" className="space-y-6">
            {/* Add Team Form */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Add New Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTeam} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input
                      id="teamName"
                      value={teamForm.name}
                      onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                      placeholder="Enter team name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamContact">Team Contact</Label>
                    <Input
                      id="teamContact"
                      value={teamForm.contact}
                      onChange={(e) => setTeamForm({ ...teamForm, contact: e.target.value })}
                      placeholder="Manager email or phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamCaptain">Team Captain</Label>
                    <Input
                      id="teamCaptain"
                      value={teamForm.captain}
                      onChange={(e) => setTeamForm({ ...teamForm, captain: e.target.value })}
                      placeholder="Captain name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input
                      id="teamSize"
                      type="number"
                      min={1}
                      value={teamForm.teamSize}
                      onChange={(e) => setTeamForm({ ...teamForm, teamSize: Number(e.target.value) })}
                      placeholder="Team size"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" variant="gaming" className="w-full">
                      Add Team
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Teams List */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Registered Teams ({teams.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{team.name}</span>
                        <Badge variant="outline">
                          {team.credits} Credits
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Contact: {team.contact}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteTeam(team.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {teams.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No teams registered yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};