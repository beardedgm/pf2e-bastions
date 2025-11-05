import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Building2, Zap, User, BookOpen } from "lucide-react";
import { useState } from "react";
import type { Facility, OrderType } from "@shared/schema";
import { FACILITY_TIERS, type FacilityTier } from "@shared/schema";
import { FACILITY_DATA, COMPANION_DATA } from "@shared/facilityData";

interface FacilityDetailModalProps {
  facility: Facility | null;
  open: boolean;
  onClose: () => void;
  characterLevel: number;
  onUpdateOrder?: (facilityId: string, order: OrderType | null) => void;
  onUpdateCompanion?: (facilityId: string, companionId: string | null) => void;
}

export function FacilityDetailModal({
  facility,
  open,
  onClose,
  characterLevel,
  onUpdateOrder,
  onUpdateCompanion,
}: FacilityDetailModalProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(null);

  if (!facility) return null;

  const facilityData = FACILITY_DATA[facility.facilityType as keyof typeof FACILITY_DATA];
  if (!facilityData) return null;

  const getCurrentTier = (): FacilityTier => {
    if (characterLevel >= 15) return 'master';
    if (characterLevel >= 11) return 'enhanced';
    if (characterLevel >= 7) return 'advanced';
    return 'basic';
  };

  const currentTier = getCurrentTier();
  const tierData = FACILITY_TIERS[currentTier];
  
  const availableCompanions = facilityData.companions
    ? facilityData.companions.map(id => COMPANION_DATA[id as keyof typeof COMPANION_DATA]).filter(Boolean)
    : [];

  const handleAssignOrder = () => {
    if (onUpdateOrder && selectedOrder) {
      onUpdateOrder(facility.id, selectedOrder);
      setSelectedOrder(null);
    }
  };

  const handleAssignCompanion = () => {
    if (onUpdateCompanion && selectedCompanion) {
      onUpdateCompanion(facility.id, selectedCompanion);
      setSelectedCompanion(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="font-serif text-2xl">{facility.name}</DialogTitle>
              <DialogDescription className="mt-2">
                {facilityData.description}
              </DialogDescription>
            </div>
            {facilityData.unique && (
              <Badge variant="secondary">Unique</Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Current Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Size</div>
                <div className="font-semibold capitalize">{facility.size}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Tier</div>
                <div className="font-semibold capitalize">{currentTier}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Charges</div>
                <div className="font-semibold">{facility.charges}/{tierData.charges}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <Badge variant={facility.damaged ? "destructive" : "default"} className="text-xs">
                  {facility.damaged ? "Damaged" : "Operational"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Benefits by Tier */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Tier Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(facilityData.benefits).map(([tier, benefit]) => {
                const isCurrentTier = tier === currentTier;
                const tierInfo = FACILITY_TIERS[tier as FacilityTier];
                
                return (
                  <div
                    key={tier}
                    className={`p-3 rounded-lg border ${
                      isCurrentTier
                        ? "bg-primary/5 border-primary"
                        : "bg-muted/30 border-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={isCurrentTier ? "default" : "outline"}
                        className="capitalize text-xs"
                      >
                        {tier} (Level {tierInfo.minLevel}+)
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">
                        DC {tierInfo.dc}
                      </span>
                    </div>
                    <div className="text-sm">{benefit}</div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Available Orders */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Available Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {facilityData.orders.map((order) => (
                  <Badge
                    key={order}
                    variant={facility.currentOrder === order ? "default" : "outline"}
                    className="capitalize text-xs justify-center py-2"
                  >
                    {order}
                  </Badge>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="text-sm font-semibold">Assign Order</div>
                <div className="flex gap-2">
                  <Select
                    value={selectedOrder || ""}
                    onValueChange={(v) => setSelectedOrder(v as OrderType)}
                  >
                    <SelectTrigger data-testid="select-order">
                      <SelectValue placeholder="Select an order..." />
                    </SelectTrigger>
                    <SelectContent>
                      {facilityData.orders.map((order) => (
                        <SelectItem key={order} value={order} className="capitalize">
                          {order}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleAssignOrder}
                    disabled={!selectedOrder}
                    data-testid="button-assign-order"
                  >
                    Assign
                  </Button>
                  {facility.currentOrder && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (onUpdateOrder) {
                          onUpdateOrder(facility.id, null);
                        }
                      }}
                      data-testid="button-clear-order"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {facility.currentOrder && (
                  <div className="text-xs text-muted-foreground">
                    Current: <span className="capitalize font-semibold">{facility.currentOrder}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Companions */}
          {availableCompanions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-serif flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Available Companions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableCompanions.map((companion) => (
                  <div
                    key={companion.id}
                    className={`p-3 rounded-lg border ${
                      facility.companionId === companion.id
                        ? "bg-primary/5 border-primary"
                        : "bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="font-semibold">{companion.name}</div>
                        <div className="text-xs text-muted-foreground">{companion.title}</div>
                      </div>
                      {companion.questRequired && (
                        <Badge variant="secondary" className="text-xs">Quest Required</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <strong>Bonus:</strong> {companion.bonus}
                    </div>
                    {companion.questRequired && companion.questDescription && (
                      <div className="text-xs text-muted-foreground italic">
                        {companion.questDescription}
                      </div>
                    )}
                  </div>
                ))}

                <Separator />

                <div className="space-y-3">
                  <div className="text-sm font-semibold">Assign Companion</div>
                  <div className="flex gap-2">
                    <Select
                      value={selectedCompanion || ""}
                      onValueChange={setSelectedCompanion}
                    >
                      <SelectTrigger data-testid="select-companion">
                        <SelectValue placeholder="Select a companion..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCompanions.map((companion) => (
                          <SelectItem key={companion.id} value={companion.id}>
                            {companion.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAssignCompanion}
                      disabled={!selectedCompanion}
                      data-testid="button-assign-companion"
                    >
                      Assign
                    </Button>
                    {facility.companionId && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (onUpdateCompanion) {
                            onUpdateCompanion(facility.id, null);
                          }
                        }}
                        data-testid="button-clear-companion"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  {facility.companionId && (
                    <div className="text-xs text-muted-foreground">
                      Current: <span className="font-semibold">
                        {availableCompanions.find(c => c.id === facility.companionId)?.name || facility.companionId}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order DCs Reference */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif">Order DCs by Tier</CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-sm space-y-2">
              {Object.entries(FACILITY_TIERS).map(([tier, data]) => (
                <div key={tier} className="flex items-center justify-between">
                  <span className="capitalize text-muted-foreground">
                    {tier} (Lv {data.minLevel}):
                  </span>
                  <span className={tier === currentTier ? "font-bold text-primary" : ""}>
                    DC {data.dc}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
