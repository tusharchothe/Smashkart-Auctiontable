import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Team } from "@/types/auction";

interface TeamCardProps {
  team: Team;
  className?: string;
}

export const TeamCard = ({ team, className }: TeamCardProps) => {
  const totalPlayers = team.roster.pro.length + team.roster.noob.length;
  const proSlotsUsed = team.roster.pro.length;
  const noobSlotsUsed = team.roster.noob.length;
  const creditsUsed = team.initialCredits - team.credits;
  const creditsProgress = (creditsUsed / team.initialCredits) * 100;

  const isRosterComplete = proSlotsUsed === 3 && noobSlotsUsed === 2;

  return (
    <Card className={`bg-gradient-card shadow-card border-border/50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-foreground">{team.name}</CardTitle>
          {isRosterComplete && (
            <Badge variant="default" className="bg-accent text-accent-foreground">
              COMPLETE
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pro Players:</span>
              <span className="text-sm font-semibold text-pro">
                {proSlotsUsed}/3
              </span>
            </div>
            <div className="space-y-1">
              {team.roster.pro.map((player, index) => (
                <div key={index} className="text-xs bg-pro/10 text-pro-foreground px-2 py-1 rounded">
                  {player}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Noob Players:</span>
              <span className="text-sm font-semibold text-noob">
                {noobSlotsUsed}/2
              </span>
            </div>
            <div className="space-y-1">
              {team.roster.noob.map((player, index) => (
                <div key={index} className="text-xs bg-noob/10 text-noob-foreground px-2 py-1 rounded">
                  {player}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Credits:</span>
            <span className="font-bold text-primary">
              {team.credits}/{team.initialCredits}
            </span>
          </div>
          <Progress value={creditsProgress} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">
            {creditsUsed} credits spent
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Players:</span>
          <span className="font-semibold text-foreground">{totalPlayers}/5</span>
        </div>
      </CardContent>
    </Card>
  );
};