import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FACILITY_SIZES, type FacilitySize } from "@shared/schema";
import type { FacilityData } from "@shared/schema";

interface FacilityCardProps {
  facility: FacilityData;
  onAdd: (facilityType: string, size: FacilitySize) => void;
  currentGold: number;
  disabled?: boolean;
}

export function FacilityCard({ facility, onAdd, currentGold, disabled = false }: FacilityCardProps) {
  const [selectedSize, setSelectedSize] = useState<FacilitySize>(facility.defaultSize);
  const cost = FACILITY_SIZES[selectedSize].cost;
  const canAfford = currentGold >= cost;

  return (
    <Card className="hover-elevate transition-all" data-testid={`card-add-${facility.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-serif">{facility.name}</CardTitle>
            <CardDescription className="text-xs mt-1 line-clamp-2">
              {facility.description}
            </CardDescription>
          </div>
          {facility.unique && (
            <Badge variant="secondary" className="text-xs">Unique</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Select value={selectedSize} onValueChange={(v) => setSelectedSize(v as FacilitySize)}>
            <SelectTrigger className="h-8 text-xs" data-testid={`select-size-${facility.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cramped">Cramped (300 gp)</SelectItem>
              <SelectItem value="roomy">Roomy (800 gp)</SelectItem>
              <SelectItem value="vast">Vast (2,500 gp)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            size="sm"
            onClick={() => onAdd(facility.id, selectedSize)}
            disabled={!canAfford || disabled}
            data-testid={`button-add-${facility.id}`}
          >
            <Plus className="h-3 w-3 mr-1" />
            {cost} gp
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {facility.benefits.basic}
        </div>
      </CardContent>
    </Card>
  );
}
