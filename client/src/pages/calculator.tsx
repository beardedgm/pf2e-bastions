import { useState } from "react";
import { Calculator as CalcIcon, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FACILITY_SIZES, INCOME_CAPS, type FacilitySize } from "@shared/schema";

export default function Calculator() {
  const [facilitySize, setFacilitySize] = useState<FacilitySize>("roomy");
  const [enlargeFrom, setEnlargeFrom] = useState<FacilitySize>("cramped");
  const [enlargeTo, setEnlargeTo] = useState<FacilitySize>("roomy");
  const [wallSections, setWallSections] = useState(20);
  const [wallWalkway, setWallWalkway] = useState(false);
  const [characterLevel, setCharacterLevel] = useState(5);
  const [incomeAmount, setIncomeAmount] = useState(0);

  // Facility Cost Calculation
  const facilityCost = FACILITY_SIZES[facilitySize].cost;

  // Enlargement Cost Calculation
  const enlargementCost = FACILITY_SIZES[enlargeTo].cost - FACILITY_SIZES[enlargeFrom].cost;

  // Wall Cost Calculation
  const wallCostPerSection = 20 + (wallWalkway ? 5 : 0);
  const totalWallCost = wallSections * wallCostPerSection;
  const wallTime = Math.ceil(wallSections / 10) * 5; // 5 days per 50 feet (10 sections)

  // Income Cap Calculation
  const getIncomeCap = () => {
    if (characterLevel >= 17) return INCOME_CAPS[17];
    if (characterLevel >= 13) return INCOME_CAPS[13];
    if (characterLevel >= 9) return INCOME_CAPS[9];
    return INCOME_CAPS[5];
  };

  const incomeCap = getIncomeCap();
  const excessIncome = Math.max(0, incomeAmount - incomeCap);
  const actualIncome = Math.min(incomeAmount, incomeCap);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <CalcIcon className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-3xl font-bold">Cost Calculator</h1>
          </div>
          <p className="text-muted-foreground">
            Calculate facility costs, enlargements, defensive walls, and income caps
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Facility Cost */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Facility Construction</CardTitle>
                <CardDescription>Calculate the cost of a new facility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facility-size">Facility Size</Label>
                  <Select
                    value={facilitySize}
                    onValueChange={(v) => setFacilitySize(v as FacilitySize)}
                  >
                    <SelectTrigger id="facility-size" data-testid="select-facility-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cramped">Cramped (4 squares)</SelectItem>
                      <SelectItem value="roomy">Roomy (16 squares)</SelectItem>
                      <SelectItem value="vast">Vast (36 squares)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Construction Cost:</span>
                    <Badge variant="default" className="font-mono text-base">
                      {facilityCost} gp
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Construction time: 1 Bastion turn
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enlargement Cost */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Facility Enlargement</CardTitle>
                <CardDescription>Calculate the cost to enlarge an existing facility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="enlarge-from">Current Size</Label>
                    <Select
                      value={enlargeFrom}
                      onValueChange={(v) => setEnlargeFrom(v as FacilitySize)}
                    >
                      <SelectTrigger id="enlarge-from" data-testid="select-enlarge-from">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cramped">Cramped</SelectItem>
                        <SelectItem value="roomy">Roomy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enlarge-to">New Size</Label>
                    <Select
                      value={enlargeTo}
                      onValueChange={(v) => setEnlargeTo(v as FacilitySize)}
                    >
                      <SelectTrigger id="enlarge-to" data-testid="select-enlarge-to">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="roomy">Roomy</SelectItem>
                        <SelectItem value="vast">Vast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Enlargement Cost:</span>
                    <Badge
                      variant={enlargementCost > 0 ? "default" : "secondary"}
                      className="font-mono text-base"
                    >
                      {enlargementCost > 0 ? `${enlargementCost} gp` : "Invalid"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Enlargement time: 1 Bastion turn
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Cramped → Roomy:</span>
                    <span className="font-mono">500 gp</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Roomy → Vast:</span>
                    <span className="font-mono">1,700 gp</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cramped → Vast:</span>
                    <span className="font-mono">2,200 gp</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Defensive Walls */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Defensive Walls</CardTitle>
                <CardDescription>Calculate the cost of defensive walls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wall-sections">Number of 5-foot Sections</Label>
                  <Input
                    id="wall-sections"
                    type="number"
                    value={wallSections}
                    onChange={(e) => setWallSections(parseInt(e.target.value) || 0)}
                    min={0}
                    data-testid="input-wall-sections"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="wall-walkway"
                    checked={wallWalkway}
                    onChange={(e) => setWallWalkway(e.target.checked)}
                    className="rounded border-input"
                    data-testid="checkbox-walkway"
                  />
                  <Label htmlFor="wall-walkway" className="cursor-pointer">
                    Include walkway (+5 gp per section)
                  </Label>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Wall Cost:</span>
                    <Badge variant="default" className="font-mono text-base">
                      {totalWallCost} gp
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Cost per section:</span>
                    <span className="font-mono">{wallCostPerSection} gp</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Construction time:</span>
                    <span className="font-mono">{wallTime} days</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mt-3">
                  <strong>Benefit:</strong> If completely enclosed, reduce casualty dice by 2 (minimum 2 dice)
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Outputs */}
          <div className="space-y-6">
            {/* Income Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Income Cap Calculator</CardTitle>
                <CardDescription>Calculate income limits based on character level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="char-level">Character Level</Label>
                  <Select
                    value={characterLevel.toString()}
                    onValueChange={(v) => setCharacterLevel(parseInt(v))}
                  >
                    <SelectTrigger id="char-level" data-testid="select-income-level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          Level {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income-amount">Total Income This Turn (gp)</Label>
                  <Input
                    id="income-amount"
                    type="number"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(parseInt(e.target.value) || 0)}
                    min={0}
                    data-testid="input-income-amount"
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Income Cap:</span>
                    <Badge variant="outline" className="font-mono text-base">
                      {incomeCap} gp/turn
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Actual Income:</span>
                    <Badge variant="default" className="font-mono text-base">
                      {actualIncome} gp
                    </Badge>
                  </div>

                  {excessIncome > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Excess Income:</span>
                      <Badge variant="secondary" className="font-mono text-base">
                        {excessIncome} gp
                      </Badge>
                    </div>
                  )}
                </div>

                {excessIncome > 0 && (
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <div className="font-semibold mb-2">Excess Conversion</div>
                    <div className="text-muted-foreground space-y-1">
                      <div>Excess income converts to non-monetary benefits:</div>
                      <div>• +1 Diplomacy bonus for 1 week per 1 gp</div>
                      <div>• Favors with local merchants</div>
                      <div>• Temporary influence in the region</div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                  <div className="flex justify-between">
                    <span>Levels 5-8:</span>
                    <span className="font-mono">50 gp/turn</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Levels 9-12:</span>
                    <span className="font-mono">100 gp/turn</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Levels 13-16:</span>
                    <span className="font-mono">150 gp/turn</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Levels 17+:</span>
                    <span className="font-mono">250 gp/turn</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Cost Summary</CardTitle>
                <CardDescription>Overview of all calculated costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm text-muted-foreground">New {facilitySize} facility:</span>
                  <span className="font-bold">{facilityCost} gp</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm text-muted-foreground">Enlargement:</span>
                  <span className="font-bold">
                    {enlargementCost > 0 ? `${enlargementCost} gp` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm text-muted-foreground">Defensive walls:</span>
                  <span className="font-bold">{totalWallCost} gp</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg text-primary">
                    {facilityCost + (enlargementCost > 0 ? enlargementCost : 0) + totalWallCost} gp
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-base">Important Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>• All construction costs are fixed regardless of character level</div>
                <div>• Facilities take 1 Bastion turn to construct</div>
                <div>• Tier upgrades happen automatically at appropriate levels</div>
                <div>• Income from all Trade orders counts toward the cap</div>
                <div>• Defensive walls take 5 days per 50 feet (10 sections)</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
