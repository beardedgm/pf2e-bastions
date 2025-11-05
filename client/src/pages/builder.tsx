import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Castle, Plus, Trash2, Save, DollarSign, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { FACILITY_DATA } from "@shared/facilityData";
import { FACILITY_SIZES, INCOME_CAPS, type FacilitySize, type Bastion, type Facility, type OrderType } from "@shared/schema";
import { FacilityCard } from "@/components/facility-card";
import { BastionSummary } from "@/components/bastion-summary";
import { FacilityDetailModal } from "@/components/facility-detail-modal";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Builder() {
  const { toast } = useToast();
  const [currentBastionId, setCurrentBastionId] = useState<string | null>(null);
  const [bastionName, setBastionName] = useState("My Bastion");
  const [characterLevel, setCharacterLevel] = useState(5);
  const [gold, setGold] = useState(0);
  const [defenders, setDefenders] = useState(0);
  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);

  // Fetch all bastions
  const { data: bastions = [], isLoading: loadingBastions } = useQuery<Bastion[]>({
    queryKey: ['/api/bastions'],
  });

  // Fetch facilities for current bastion
  const { data: facilities = [], isLoading: loadingFacilities } = useQuery<Facility[]>({
    queryKey: ['/api/bastions', currentBastionId, 'facilities'],
    enabled: !!currentBastionId,
  });

  // Create bastion mutation - no success handlers, state managed by callers
  const createBastionMutation = useMutation({
    mutationFn: async (data: { name: string; characterLevel: number; gold: number; defenders: number }) => {
      return await apiRequest<Bastion>('POST', '/api/bastions', data);
    },
  });

  // Update bastion mutation - no success handlers, state managed by callers
  const updateBastionMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<Bastion> }) => {
      return await apiRequest<Bastion>('PATCH', `/api/bastions/${data.id}`, data.updates);
    },
  });

  // Create facility mutation - no success handlers, state managed by callers
  const createFacilityMutation = useMutation({
    mutationFn: async (data: { bastionId: string; facilityType: string; name: string; size: string }) => {
      return await apiRequest<Facility>('POST', '/api/facilities', {
        bastionId: data.bastionId,
        facilityType: data.facilityType,
        name: data.name,
        size: data.size,
        charges: 1,
        damaged: false,
      });
    },
  });

  // Delete facility mutation - no success handlers, state managed by callers
  const deleteFacilityMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/facilities/${id}`, undefined);
    },
  });

  // Update facility mutation - for order and companion assignments
  const updateFacilityMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<Facility> }) => {
      return await apiRequest<Facility>('PATCH', `/api/facilities/${data.id}`, data.updates);
    },
  });

  // Load current bastion data
  useEffect(() => {
    if (bastions.length > 0 && !currentBastionId) {
      const latest = bastions[0];
      setCurrentBastionId(latest.id);
      setBastionName(latest.name);
      setCharacterLevel(latest.characterLevel);
      setGold(latest.gold);
      setDefenders(latest.defenders);
    }
  }, [bastions, currentBastionId]);

  // Always sync facilities from backend
  useEffect(() => {
    if (currentBastionId) {
      setSelectedFacilities(facilities);
    } else {
      setSelectedFacilities([]);
    }
  }, [facilities, currentBastionId]);

  const addFacility = async (facilityType: string, size: FacilitySize) => {
    const facilityData = FACILITY_DATA[facilityType];
    if (!facilityData) return;

    const cost = FACILITY_SIZES[size].cost;
    if (gold < cost) {
      toast({
        title: "Insufficient Gold",
        description: `You need ${cost} gp to build this facility.`,
        variant: "destructive",
      });
      return;
    }

    const newGold = gold - cost;
    const wasNewBastion = !currentBastionId;
    let createdBastionId: string | null = null;

    try {
      let bastionId = currentBastionId;

      // Create bastion if it doesn't exist
      if (!bastionId) {
        const newBastion = await createBastionMutation.mutateAsync({
          name: bastionName,
          characterLevel,
          gold: newGold,
          defenders,
        });
        bastionId = newBastion.id;
        createdBastionId = bastionId;
      }

      // Create facility
      let newFacility;
      try {
        newFacility = await createFacilityMutation.mutateAsync({
          bastionId,
          facilityType,
          name: facilityData.name,
          size,
        });
      } catch (facilityError) {
        // Rollback: delete the bastion we just created and reset state
        if (createdBastionId) {
          await apiRequest('DELETE', `/api/bastions/${createdBastionId}`, undefined);
          // Don't set currentBastionId since the bastion was deleted
        }
        throw facilityError;
      }

      // Update gold (only if bastion already existed)
      if (currentBastionId) {
        try {
          await updateBastionMutation.mutateAsync({
            id: bastionId,
            updates: { gold: newGold },
          });
        } catch (goldUpdateError) {
          // Rollback: delete the facility if gold update failed (use direct API call to avoid side effects)
          await apiRequest('DELETE', `/api/facilities/${newFacility.id}`, undefined);
          throw goldUpdateError;
        }
      }

      // Success: update local state and notify user only after all operations complete
      if (createdBastionId) {
        setCurrentBastionId(createdBastionId);
        toast({
          title: "Bastion Created",
          description: "Your bastion and first facility have been created successfully.",
        });
      } else {
        toast({
          title: "Facility Added",
          description: `${facilityData.name} has been added to your bastion.`,
        });
      }
      setGold(newGold);
      
      // Invalidate queries to fetch updated data
      queryClient.invalidateQueries({ queryKey: ['/api/bastions'] });
      if (currentBastionId || createdBastionId) {
        const bastionId = currentBastionId || createdBastionId;
        queryClient.invalidateQueries({ queryKey: ['/api/bastions', bastionId, 'facilities'] });
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add facility. No changes were made.",
        variant: "destructive",
      });
      // Refetch to ensure UI is in sync
      queryClient.invalidateQueries({ queryKey: ['/api/bastions'] });
      if (currentBastionId) {
        queryClient.invalidateQueries({ queryKey: ['/api/bastions', currentBastionId, 'facilities'] });
      }
    }
  };

  const removeFacility = async (id: string) => {
    const facility = selectedFacilities.find(f => f.id === id);
    if (!facility || !currentBastionId) return;

    const cost = FACILITY_SIZES[facility.size as FacilitySize].cost;
    const newGold = gold + cost;

    try {
      // Delete facility first
      await deleteFacilityMutation.mutateAsync(id);

      // Update gold - rollback not needed since we can't restore a deleted facility
      // If this fails, the user gets more gold than they should, which is acceptable
      try {
        await updateBastionMutation.mutateAsync({
          id: currentBastionId,
          updates: { gold: newGold },
        });
        setGold(newGold);
        
        // Success: notify user and invalidate queries
        toast({
          title: "Facility Removed",
          description: `${facility.name} has been removed from your bastion.`,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/bastions'] });
        queryClient.invalidateQueries({ queryKey: ['/api/bastions', currentBastionId, 'facilities'] });
      } catch (goldUpdateError) {
        // Gold update failed but facility is deleted - refetch to sync
        queryClient.invalidateQueries({ queryKey: ['/api/bastions'] });
        queryClient.invalidateQueries({ queryKey: ['/api/bastions', currentBastionId, 'facilities'] });
        toast({
          title: "Partial Success",
          description: "Facility removed but gold update failed. Refreshing data.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove facility.",
        variant: "destructive",
      });
      // Refetch to ensure UI is in sync
      queryClient.invalidateQueries({ queryKey: ['/api/bastions', currentBastionId, 'facilities'] });
    }
  };

  const saveBastion = async () => {
    try {
      if (!currentBastionId) {
        const newBastion = await createBastionMutation.mutateAsync({
          name: bastionName,
          characterLevel,
          gold,
          defenders,
        });
        setCurrentBastionId(newBastion.id);
        toast({
          title: "Bastion Created",
          description: `${newBastion.name} has been created successfully.`,
        });
      } else {
        await updateBastionMutation.mutateAsync({
          id: currentBastionId,
          updates: {
            name: bastionName,
            characterLevel,
            gold,
            defenders,
          },
        });
        toast({
          title: "Bastion Updated",
          description: "Your bastion has been updated successfully.",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/bastions'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save bastion.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrder = async (facilityId: string, order: OrderType | null) => {
    if (!currentBastionId) return;

    try {
      await updateFacilityMutation.mutateAsync({
        id: facilityId,
        updates: { currentOrder: order },
      });

      await queryClient.invalidateQueries({ queryKey: ['/api/bastions', currentBastionId, 'facilities'] });

      toast({
        title: "Order Assigned",
        description: order ? `Assigned ${order} order to facility.` : "Order cleared.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign order.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCompanion = async (facilityId: string, companionId: string | null) => {
    if (!currentBastionId) return;

    try {
      await updateFacilityMutation.mutateAsync({
        id: facilityId,
        updates: { companionId },
      });

      await queryClient.invalidateQueries({ queryKey: ['/api/bastions', currentBastionId, 'facilities'] });

      toast({
        title: "Companion Assigned",
        description: companionId ? "Companion assigned to facility." : "Companion removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign companion.",
        variant: "destructive",
      });
    }
  };

  const totalCost = selectedFacilities.reduce((sum, f) => {
    return sum + FACILITY_SIZES[f.size as FacilitySize].cost;
  }, 0);

  const isModifying = 
    createFacilityMutation.isPending || 
    deleteFacilityMutation.isPending || 
    updateBastionMutation.isPending;

  const getFacilityTier = () => {
    if (characterLevel >= 15) return "master";
    if (characterLevel >= 11) return "enhanced";
    if (characterLevel >= 7) return "advanced";
    return "basic";
  };

  const getIncomeCap = () => {
    if (characterLevel >= 17) return INCOME_CAPS[17];
    if (characterLevel >= 13) return INCOME_CAPS[13];
    if (characterLevel >= 9) return INCOME_CAPS[9];
    return INCOME_CAPS[5];
  };

  const facilitiesByCategory = Object.values(FACILITY_DATA).reduce((acc, facility) => {
    if (!acc[facility.category]) acc[facility.category] = [];
    acc[facility.category].push(facility);
    return acc;
  }, {} as Record<string, typeof FACILITY_DATA[string][]>);

  const selectedFacilityForDetail = selectedFacilityId 
    ? selectedFacilities.find(f => f.id === selectedFacilityId) || null
    : null;

  if (loadingBastions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Castle className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your bastions...</p>
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
            <Castle className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-3xl font-bold">Bastion Builder</h1>
          </div>
          <p className="text-muted-foreground">
            Create and manage your character's Bastion with facility selection and cost tracking
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bastion Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Bastion Configuration</CardTitle>
                <CardDescription>Set up your Bastion's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bastion-name">Bastion Name</Label>
                    <Input
                      id="bastion-name"
                      value={bastionName}
                      onChange={(e) => setBastionName(e.target.value)}
                      placeholder="Enter bastion name"
                      data-testid="input-bastion-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="character-level">Character Level</Label>
                    <Select
                      value={characterLevel.toString()}
                      onValueChange={(v) => setCharacterLevel(parseInt(v))}
                    >
                      <SelectTrigger id="character-level" data-testid="select-level">
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
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gold">Available Gold (gp)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="gold"
                        type="number"
                        value={gold}
                        onChange={(e) => setGold(parseInt(e.target.value) || 0)}
                        placeholder="0"
                        data-testid="input-gold"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setGold(gold + 1000)}
                        data-testid="button-add-gold"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defenders">Bastion Defenders</Label>
                    <Input
                      id="defenders"
                      type="number"
                      value={defenders}
                      onChange={(e) => setDefenders(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      data-testid="input-defenders"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Badge variant="outline" className="capitalize">
                    {getFacilityTier()} Tier
                  </Badge>
                  <Badge variant="outline">
                    Income Cap: {getIncomeCap()} gp/turn
                  </Badge>
                  <Badge variant="outline">
                    {selectedFacilities.length} Facilities
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Available Facilities */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Add Facilities</CardTitle>
                <CardDescription>Select facilities to add to your Bastion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(facilitiesByCategory).map(([category, facilities]) => (
                  <div key={category}>
                    <h3 className="font-serif font-semibold mb-3 capitalize">{category}</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {facilities
                        .filter((f) => f.minLevel <= characterLevel)
                        .map((facility) => (
                          <FacilityCard
                            key={facility.id}
                            facility={facility}
                            onAdd={addFacility}
                            currentGold={gold}
                            disabled={isModifying || loadingFacilities}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <BastionSummary
              bastionName={bastionName}
              level={characterLevel}
              tier={getFacilityTier()}
              gold={gold}
              defenders={defenders}
              facilities={selectedFacilities}
              totalCost={totalCost}
              incomeCap={getIncomeCap()}
              onRemoveFacility={removeFacility}
              onViewDetails={(facility) => setSelectedFacilityId(facility.id)}
              onSave={saveBastion}
              isSaving={createBastionMutation.isPending || updateBastionMutation.isPending}
            />
          </div>
        </div>
      </div>

      {/* Facility Detail Modal */}
      <FacilityDetailModal
        facility={selectedFacilityForDetail}
        open={!!selectedFacilityId}
        onClose={() => setSelectedFacilityId(null)}
        characterLevel={characterLevel}
        onUpdateOrder={handleUpdateOrder}
        onUpdateCompanion={handleUpdateCompanion}
      />
    </div>
  );
}
