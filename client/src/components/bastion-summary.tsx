import { Trash2, Save, Download, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Facility } from "@shared/schema";

interface BastionSummaryProps {
  bastionName: string;
  level: number;
  tier: string;
  gold: number;
  defenders: number;
  facilities: Facility[];
  totalCost: number;
  incomeCap: number;
  onRemoveFacility: (id: string) => void;
  onViewDetails?: (facility: Facility) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export function BastionSummary({
  bastionName,
  level,
  tier,
  gold,
  defenders,
  facilities,
  totalCost,
  incomeCap,
  onRemoveFacility,
  onViewDetails,
  onSave,
  isSaving = false,
}: BastionSummaryProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="font-serif">{bastionName}</CardTitle>
        <CardDescription>Level {level} Bastion</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 font-mono text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Gold</div>
            <div className="font-bold">{gold} gp</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Defenders</div>
            <div className="font-bold">{defenders}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Tier</div>
            <div className="font-bold capitalize">{tier}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Income Cap</div>
            <div className="font-bold">{incomeCap} gp/turn</div>
          </div>
        </div>

        <Separator />

        {/* Facilities List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Facilities ({facilities.length})</h4>
            <Badge variant="outline" className="font-mono text-xs">
              {totalCost} gp
            </Badge>
          </div>

          {facilities.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              No facilities added yet
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {facilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="flex items-center justify-between gap-2 p-3 rounded-lg border bg-card hover-elevate"
                    data-testid={`facility-item-${facility.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{facility.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {facility.size}
                        {facility.currentOrder && (
                          <span className="ml-2">• {facility.currentOrder}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {onViewDetails && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onViewDetails(facility)}
                          className="h-8 w-8"
                          data-testid={`button-view-${facility.id}`}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onRemoveFacility(facility.id)}
                        className="h-8 w-8"
                        data-testid={`button-remove-${facility.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button 
            className="w-full" 
            onClick={onSave}
            disabled={isSaving}
            data-testid="button-save-bastion"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Bastion"}
          </Button>
          <Button variant="outline" className="w-full" data-testid="button-export-bastion">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
