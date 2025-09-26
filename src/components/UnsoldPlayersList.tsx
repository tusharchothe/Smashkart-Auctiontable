import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types/auction";
import { PlayerCard } from "./PlayerCard";
import { Check, X } from "lucide-react";

interface UnsoldPlayersListProps {
  unsoldPlayers: Player[];
  onSelectPlayerForRound2: (playerId: string) => void;
  selectedPlayers: string[];
}

export const UnsoldPlayersList = ({ 
  unsoldPlayers, 
  onSelectPlayerForRound2, 
  selectedPlayers 
}: UnsoldPlayersListProps) => {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <X className="h-5 w-5 text-destructive" />
          Unsold Players
          <Badge variant="outline" className="ml-auto">
            {unsoldPlayers.length} players
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {unsoldPlayers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No unsold players yet
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Select players for Round 2 auction
              </p>
              <Badge variant="secondary">
                {selectedPlayers.length} selected
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unsoldPlayers.map((player) => (
                <div key={player.id} className="relative">
                  <PlayerCard 
                    player={player}
                    isAuctionActive={false}
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant={selectedPlayers.includes(player.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => onSelectPlayerForRound2(player.id)}
                      className="h-8 w-8 p-0"
                    >
                      {selectedPlayers.includes(player.id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        "+"
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};