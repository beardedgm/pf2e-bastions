import { useState, useEffect } from "react";
import { Calendar, Play, Pause, SkipForward, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Bastion, Turn, InsertTurn } from "@shared/schema";

export default function Tracker() {
  const { toast } = useToast();
  const [selectedBastionId, setSelectedBastionId] = useState<string>("");
  
  const { data: bastions = [], isLoading: loadingBastions } = useQuery<Bastion[]>({
    queryKey: ['/api/bastions'],
  });

  const { data: turns = [], isLoading: loadingTurns } = useQuery<Turn[]>({
    queryKey: ['/api/bastions', selectedBastionId, 'turns'],
    enabled: !!selectedBastionId,
  });

  const selectedBastion = bastions.find(b => b.id === selectedBastionId);
  
  useEffect(() => {
    if (!selectedBastionId && bastions.length > 0) {
      setSelectedBastionId(bastions[0].id);
    }
  }, [bastions, selectedBastionId]);

  const createTurnMutation = useMutation({
    mutationFn: async (data: InsertTurn) => {
      return await apiRequest<Turn>('POST', '/api/turns', data);
    },
  });

  const updateBastionMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<Bastion> }) => {
      return await apiRequest<Bastion>('PATCH', `/api/bastions/${data.id}`, data.updates);
    },
  });

  const latestTurn = turns.length > 0 ? turns[0] : null;
  const currentTurnNumber = latestTurn?.turnNumber ?? 0;
  const bankedTurns = latestTurn?.bankedTurns ?? 0;
  const absentTurns = latestTurn?.absentTurns ?? 0;
  const autoMaintain = latestTurn?.autoMaintain ?? false;

  const nextEventTurn = absentTurns > 2 ? currentTurnNumber + (3 - ((absentTurns - 2) % 3)) : null;
  const canBankTurn = bankedTurns < 2;

  const advanceTurn = async () => {
    if (!selectedBastionId) return;

    try {
      const newTurn: InsertTurn = {
        bastionId: selectedBastionId,
        turnNumber: currentTurnNumber + 1,
        bankedTurns,
        absentTurns: 0,
        autoMaintain: false,
      };

      await createTurnMutation.mutateAsync(newTurn);
      await queryClient.invalidateQueries({ queryKey: ['/api/bastions', selectedBastionId, 'turns'] });

      toast({
        title: "Turn Advanced",
        description: `Now on Bastion Turn ${currentTurnNumber + 1}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to advance turn",
        variant: "destructive",
      });
    }
  };

  const bankTurn = async () => {
    if (!selectedBastionId || !canBankTurn) return;

    try {
      const newTurn: InsertTurn = {
        bastionId: selectedBastionId,
        turnNumber: currentTurnNumber + 1,
        bankedTurns: bankedTurns + 1,
        absentTurns: absentTurns + 1,
        autoMaintain,
      };

      await createTurnMutation.mutateAsync(newTurn);
      await queryClient.invalidateQueries({ queryKey: ['/api/bastions', selectedBastionId, 'turns'] });

      toast({
        title: "Turn Banked",
        description: `${bankedTurns + 1} turn(s) banked`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to bank turn",
        variant: "destructive",
      });
    }
  };

  const useBankedTurn = async () => {
    if (!selectedBastionId || bankedTurns === 0) return;

    try {
      const newTurn: InsertTurn = {
        bastionId: selectedBastionId,
        turnNumber: currentTurnNumber + 1,
        bankedTurns: bankedTurns - 1,
        absentTurns: 0,
        autoMaintain: false,
      };

      await createTurnMutation.mutateAsync(newTurn);
      await queryClient.invalidateQueries({ queryKey: ['/api/bastions', selectedBastionId, 'turns'] });

      toast({
        title: "Banked Turn Used",
        description: "Taking a Bastion turn from your bank",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to use banked turn",
        variant: "destructive",
      });
    }
  };

  const triggerAutoMaintain = async () => {
    if (!selectedBastionId) return;

    try {
      const newTurn: InsertTurn = {
        bastionId: selectedBastionId,
        turnNumber: currentTurnNumber + 1,
        bankedTurns,
        absentTurns: absentTurns + 1,
        autoMaintain: true,
      };

      await createTurnMutation.mutateAsync(newTurn);
      await queryClient.invalidateQueries({ queryKey: ['/api/bastions', selectedBastionId, 'turns'] });

      toast({
        title: "Auto-Maintain",
        description: "All facilities are maintaining",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger auto-maintain",
        variant: "destructive",
      });
    }
  };

  if (loadingBastions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading bastions...</div>
        </div>
      </div>
    );
  }

  if (bastions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold mb-2">No Bastions Found</h2>
          <p className="text-muted-foreground">Create a bastion in the Builder to start tracking turns.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-3xl font-bold">Turn Tracker</h1>
          </div>
          <p className="text-muted-foreground mb-4">
            Manage Bastion turns, track banking, and monitor event triggers
          </p>
          
          {/* Bastion Selector */}
          <div className="max-w-sm">
            <Select value={selectedBastionId} onValueChange={setSelectedBastionId}>
              <SelectTrigger data-testid="select-bastion">
                <SelectValue placeholder="Select a bastion" />
              </SelectTrigger>
              <SelectContent>
                {bastions.map((bastion) => (
                  <SelectItem key={bastion.id} value={bastion.id}>
                    {bastion.name} (Level {bastion.characterLevel})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {loadingTurns ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading turn data...</div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Current Status */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Turn Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Current Turn Status</CardTitle>
                  <CardDescription>Overview of your Bastion's current state</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <div className="text-3xl font-bold font-mono mb-1" data-testid="text-current-turn">
                        {currentTurnNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">Current Turn</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <div className="text-3xl font-bold font-mono mb-1" data-testid="text-banked-turns">
                        {bankedTurns}/2
                      </div>
                      <div className="text-sm text-muted-foreground">Banked Turns</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <div className="text-3xl font-bold font-mono mb-1" data-testid="text-absent-turns">
                        {absentTurns}
                      </div>
                      <div className="text-sm text-muted-foreground">Absent Turns</div>
                    </div>
                  </div>

                  {autoMaintain && (
                    <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">Auto-Maintain Active</div>
                        <div className="text-xs text-muted-foreground">
                          All facilities are automatically maintaining
                        </div>
                      </div>
                    </div>
                  )}

                  {nextEventTurn && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">Event Warning</div>
                        <div className="text-xs text-muted-foreground">
                          Next event will occur on Turn {nextEventTurn}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Turn Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Turn Actions</CardTitle>
                  <CardDescription>Manage your Bastion turns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-3">
                    <Button
                      onClick={advanceTurn}
                      className="w-full"
                      disabled={createTurnMutation.isPending}
                      data-testid="button-advance-turn"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Take Turn
                    </Button>
                    <Button
                      onClick={bankTurn}
                      variant="outline"
                      disabled={!canBankTurn || createTurnMutation.isPending}
                      className="w-full"
                      data-testid="button-bank-turn"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Bank Turn
                    </Button>
                    <Button
                      onClick={useBankedTurn}
                      variant="outline"
                      disabled={bankedTurns === 0 || createTurnMutation.isPending}
                      className="w-full"
                      data-testid="button-use-banked"
                    >
                      <SkipForward className="h-4 w-4 mr-2" />
                      Use Banked
                    </Button>
                  </div>

                  {bankedTurns >= 2 && !autoMaintain && (
                    <Button
                      onClick={triggerAutoMaintain}
                      variant="secondary"
                      className="w-full"
                      disabled={createTurnMutation.isPending}
                      data-testid="button-auto-maintain"
                    >
                      Trigger Auto-Maintain
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Timeline Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Turn Timeline</CardTitle>
                  <CardDescription>Visual representation of turn progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[...Array(10)].map((_, i) => {
                      const turnNum = currentTurnNumber - 5 + i;
                      if (turnNum < 1) return null;
                      
                      const isCurrent = turnNum === currentTurnNumber;
                      const isEvent = nextEventTurn === turnNum;
                      const isPast = turnNum < currentTurnNumber;
                      
                      return (
                        <div
                          key={turnNum}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            isCurrent
                              ? "bg-primary/10 border-primary"
                              : isPast
                              ? "bg-muted/50 border-muted"
                              : "border-border"
                          }`}
                          data-testid={`timeline-turn-${turnNum}`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold ${
                              isCurrent
                                ? "bg-primary text-primary-foreground"
                                : isPast
                                ? "bg-muted text-muted-foreground"
                                : "bg-background border-2"
                            }`}
                          >
                            {turnNum}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">
                              Turn {turnNum}
                              {isCurrent && " (Current)"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {isPast && "Completed"}
                              {isCurrent && "In Progress"}
                              {!isPast && !isCurrent && "Upcoming"}
                            </div>
                          </div>
                          {isEvent && (
                            <Badge variant="destructive">Event Roll</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Rules & Reference */}
            <div className="space-y-6">
              {/* Turn Banking Rules */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-base">Turn Banking</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3 text-muted-foreground">
                  <div>
                    <strong className="text-foreground">Bank Limit:</strong> Up to 2 turns
                  </div>
                  <Separator />
                  <div>
                    <strong className="text-foreground">Auto-Maintain:</strong> After 2 banked turns,
                    all facilities automatically maintain
                  </div>
                  <Separator />
                  <div>
                    <strong className="text-foreground">Duration:</strong> Each turn is 7 in-game days
                  </div>
                </CardContent>
              </Card>

              {/* Event Triggers */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-base">Event Triggers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3 text-muted-foreground">
                  <div>
                    Bastion Events occur every 3rd turn of absence after auto-maintain begins
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <div className="font-mono text-xs">
                      <div>Turn 1-2: Bank (no events)</div>
                      <div>Turn 3-4: Auto-maintain</div>
                      <div className="text-destructive">Turn 5: EVENT ROLL</div>
                      <div>Turn 6-7: Auto-maintain</div>
                      <div className="text-destructive">Turn 8: EVENT ROLL</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-base">Order Reference</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Maintain:</span>
                    <Badge variant="outline">Auto-success</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Trade:</span>
                    <Badge variant="outline">Earn Income</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Craft:</span>
                    <Badge variant="outline">Create Items</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Recruit:</span>
                    <Badge variant="outline">Gain Defenders</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Research:</span>
                    <Badge variant="outline">Gather Info</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* DCs by Tier */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-base">DCs by Tier</CardTitle>
                </CardHeader>
                <CardContent className="font-mono text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Basic (Lv 5):</span>
                    <span className="font-bold">DC 16</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Advanced (Lv 7):</span>
                    <span className="font-bold">DC 22</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Enhanced (Lv 11):</span>
                    <span className="font-bold">DC 28</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Master (Lv 15):</span>
                    <span className="font-bold">DC 34</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
