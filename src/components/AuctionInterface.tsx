import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Player, Team } from "@/types/auction";

interface AuctionInterfaceProps {
  currentPlayer: Player | null;
  teams: Team[];
  onConfirmSale: (playerId: string, teamId: string, amount: number) => void;
  onMarkUnsold: (playerId: string) => void;
  onNextPlayer: () => void;
}

export const AuctionInterface = ({ 
  currentPlayer, 
  teams, 
  onConfirmSale, 
  onMarkUnsold, 
  onNextPlayer 
}: AuctionInterfaceProps) => {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [bidAmount, setBidAmount] = useState<number>(0);
  const { toast } = useToast();

  if (!currentPlayer) {
    return (
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-xl font-bold text-muted-foreground mb-2">No Player Selected</h3>
            <p className="text-muted-foreground">Start the auction to begin bidding</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPro = currentPlayer.classification === 'Pro';
  const baseIncrement = isPro ? 8 : 2;
  const minBid = currentPlayer.currentBid ? currentPlayer.currentBid + baseIncrement : baseIncrement;

  const handleConfirmSale = () => {
    if (!selectedTeam) {
      toast({
        title: "No Team Selected",
        description: "Please select a team before confirming the sale.",
        variant: "destructive",
      });
      return;
    }

    if (bidAmount < minBid) {
      toast({
        title: "Invalid Bid",
        description: `Minimum bid is ${minBid} credits.`,
        variant: "destructive",
      });
      return;
    }

    const selectedTeamData = teams.find(t => t.id === selectedTeam);
    if (!selectedTeamData) return;

    // Check if team has enough credits
    if (selectedTeamData.credits < bidAmount) {
      toast({
        title: "Insufficient Credits",
        description: `${selectedTeamData.name} only has ${selectedTeamData.credits} credits.`,
        variant: "destructive",
      });
      return;
    }

    // Check roster limits
    if (isPro && selectedTeamData.roster.pro.length >= 3) {
      toast({
        title: "Roster Full",
        description: `${selectedTeamData.name} already has 3 Pro players.`,
        variant: "destructive",
      });
      return;
    }

    if (!isPro && selectedTeamData.roster.noob.length >= 2) {
      toast({
        title: "Roster Full",
        description: `${selectedTeamData.name} already has 2 Noob players.`,
        variant: "destructive",
      });
      return;
    }

    onConfirmSale(currentPlayer.id, selectedTeam, bidAmount);
    setSelectedTeam("");
    setBidAmount(0);
    
    toast({
      title: "Sale Confirmed!",
      description: `${currentPlayer.name} sold to ${selectedTeamData.name} for ${bidAmount} credits.`,
    });
  };

  const handleMarkUnsold = () => {
    onMarkUnsold(currentPlayer.id);
    toast({
      title: "Player Marked Unsold",
      description: `${currentPlayer.name} has been moved to the unsold pool.`,
    });
  };

  const eligibleTeams = teams.filter(team => {
    if (isPro) {
      return team.roster.pro.length < 3 && team.credits >= minBid;
    } else {
      return team.roster.noob.length < 2 && team.credits >= minBid;
    }
  });

  return (
    <Card className="bg-gradient-card shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Current Auction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Player Display */}
        <div className="text-center space-y-4 p-6 bg-muted/20 rounded-lg border border-border/30">
          <div className="flex items-center justify-center gap-4">
            <h2 className="text-3xl font-bold text-foreground">{currentPlayer.name}</h2>
            <Badge 
              variant={isPro ? "default" : "secondary"}
              className={`text-lg px-3 py-1 ${isPro ? "bg-pro text-pro-foreground" : "bg-noob text-noob-foreground"}`}
            >
              {currentPlayer.classification}
            </Badge>
          </div>
          <div className="text-xl text-muted-foreground">
            KDR: <span className="font-bold text-foreground">{currentPlayer.kdr}</span>
          </div>
          {currentPlayer.currentBid && (
            <div className="text-xl">
              Current Bid: <span className="font-bold text-primary">{currentPlayer.currentBid} credits</span>
            </div>
          )}
        </div>

        {/* Bidding Interface */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Team</label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Choose bidding team" />
              </SelectTrigger>
              <SelectContent>
                {eligibleTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name} ({team.credits} credits)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bid Amount</label>
            <Input
              type="number"
              value={bidAmount || ""}
              onChange={(e) => setBidAmount(parseInt(e.target.value) || 0)}
              placeholder={`Min: ${minBid} credits`}
              min={minBid}
              step={baseIncrement}
            />
          </div>
        </div>

        {/* Quick Bid Buttons */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground mr-2">Quick bids:</span>
          {[minBid, minBid + baseIncrement, minBid + (baseIncrement * 2), minBid + (baseIncrement * 3)].map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => setBidAmount(amount)}
              className="text-xs"
            >
              {amount}
            </Button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            variant="auction" 
            size="lg"
            onClick={handleConfirmSale}
            disabled={!selectedTeam || !bidAmount}
            className="flex-1"
          >
            Confirm Sale
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={handleMarkUnsold}
            className="flex-1"
          >
            Mark Unsold
          </Button>
        </div>

        <Button 
          variant="gaming" 
          size="lg"
          onClick={onNextPlayer}
          className="w-full"
        >
          Next Player
        </Button>
      </CardContent>
    </Card>
  );
};