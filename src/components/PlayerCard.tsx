import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@/types/auction";

interface PlayerCardProps {
  player: Player;
  onBid?: (playerId: string, amount: number) => void;
  isAuctionActive?: boolean;
}

export const PlayerCard = ({ player, onBid, isAuctionActive }: PlayerCardProps) => {
  const isPro = player.classification === 'Pro';
  const minBid = isPro ? 8 : 2;
  const nextBid = player.currentBid ? player.currentBid + (isPro ? 8 : 2) : minBid;

  return (
    <Card className="bg-gradient-card shadow-card border-border/50 hover:border-primary/30 transition-all duration-300 animate-slide-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-foreground">{player.name}</CardTitle>
          <Badge variant={isPro ? "default" : "secondary"} 
                 className={isPro ? "bg-pro text-pro-foreground" : "bg-noob text-noob-foreground"}>
            {player.classification}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">KDR:</span>
          <span className="font-semibold text-foreground">{player.kdr}</span>
        </div>
        
        {player.currentBid && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Current Bid:</span>
            <span className="font-bold text-primary">{player.currentBid} credits</span>
          </div>
        )}

        {player.team && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Team:</span>
            <span className="font-semibold text-accent">{player.team}</span>
          </div>
        )}

        {isAuctionActive && player.status === 'available' && onBid && (
          <Button 
            variant={isPro ? "pro" : "noob"}
            size="sm"
            onClick={() => onBid(player.id, nextBid)}
            className="w-full"
          >
            Bid {nextBid} credits
          </Button>
        )}

        {player.status === 'sold' && (
          <Badge variant="default" className="w-full justify-center bg-accent text-accent-foreground">
            SOLD
          </Badge>
        )}

        {player.status === 'unsold' && (
          <Badge variant="secondary" className="w-full justify-center">
            UNSOLD
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};