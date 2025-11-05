import { useState } from "react";
import { Search, Book, Castle, Scroll, Users, Dices } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FACILITY_DATA, COMPANION_DATA, ORDER_SKILLS } from "@shared/facilityData";
import { FACILITY_TIERS, INCOME_CAPS } from "@shared/schema";

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");

  const filterFacilities = () => {
    if (!searchQuery) return Object.values(FACILITY_DATA);
    const query = searchQuery.toLowerCase();
    return Object.values(FACILITY_DATA).filter(
      (f) =>
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query)
    );
  };

  const filterCompanions = () => {
    if (!searchQuery) return Object.values(COMPANION_DATA);
    const query = searchQuery.toLowerCase();
    return Object.values(COMPANION_DATA).filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.bonus.toLowerCase().includes(query)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-3xl font-bold">Documentation</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Comprehensive reference for the Pathfinder 2e Bastion System v2.1
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search facilities, companions, rules..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <Castle className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="facilities" data-testid="tab-facilities">
              <Castle className="h-4 w-4 mr-2" />
              Facilities
            </TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">
              <Scroll className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="companions" data-testid="tab-companions">
              <Users className="h-4 w-4 mr-2" />
              Companions
            </TabsTrigger>
            <TabsTrigger value="mechanics" data-testid="tab-mechanics">
              <Dices className="h-4 w-4 mr-2" />
              Mechanics
            </TabsTrigger>
            <TabsTrigger value="progression" data-testid="tab-progression">
              <Book className="h-4 w-4 mr-2" />
              Progression
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">What is a Bastion?</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  Bastions are player-controlled strongholds available from 5th level in Pathfinder 2e campaigns.
                  They represent a character's home base, providing strategic benefits, income, and narrative depth.
                </p>
                <h3 className="font-serif">Initial Setup (Level 5)</h3>
                <ul>
                  <li>2 basic facilities for free (one Cramped, one Roomy)</li>
                  <li>2 special facilities of your choice for free</li>
                  <li>0 Bastion Defenders (must recruit through facilities)</li>
                </ul>
                <h3 className="font-serif">Core Concepts</h3>
                <ul>
                  <li><strong>Facilities:</strong> Specialized buildings that provide benefits and enable orders</li>
                  <li><strong>Orders:</strong> Actions your facilities perform each Bastion turn</li>
                  <li><strong>Bastion Turns:</strong> Occur every 7 in-game days (typically every 3-5 sessions)</li>
                  <li><strong>Defenders:</strong> Guards and soldiers who protect your Bastion</li>
                  <li><strong>Companions:</strong> Named NPCs with special abilities and quests</li>
                </ul>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Facility Tiers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 font-mono text-sm">
                  {Object.entries(FACILITY_TIERS).map(([tier, data]) => (
                    <div key={tier} className="border-b pb-2 last:border-0">
                      <div className="font-bold capitalize mb-1">{tier}</div>
                      <div className="text-muted-foreground space-y-1">
                        <div>Level {data.minLevel}+</div>
                        <div>DC {data.dc}</div>
                        <div>{data.charges} Charge{data.charges > 1 ? 's' : ''}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Income Caps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Levels 5-8:</span>
                    <span className="font-bold">50 gp/turn</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Levels 9-12:</span>
                    <span className="font-bold">100 gp/turn</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Levels 13-16:</span>
                    <span className="font-bold">150 gp/turn</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Levels 17+:</span>
                    <span className="font-bold">250 gp/turn</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Bastion Turns</CardTitle>
                </CardHeader>
                <CardContent className="prose-sm dark:prose-invert">
                  <ul className="text-sm space-y-1">
                    <li>Occur every 7 in-game days</li>
                    <li>Can bank up to 2 unused turns</li>
                    <li>After 2 banked turns, auto-Maintain begins</li>
                    <li>Events roll every 3rd absent turn</li>
                    <li>All orders take exactly 7 days</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="space-y-6">
            <div className="grid gap-4">
              {filterFacilities().map((facility) => (
                <Card key={facility.id} data-testid={`card-facility-${facility.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="font-serif">{facility.name}</CardTitle>
                        <CardDescription className="mt-1">{facility.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="capitalize">
                          {facility.category}
                        </Badge>
                        <Badge variant="secondary">Level {facility.minLevel}+</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-semibold mb-1">Prerequisite</div>
                        <div className="text-muted-foreground">{facility.prerequisite}</div>
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Default Size</div>
                        <div className="text-muted-foreground capitalize">
                          {facility.defaultSize}
                          {facility.canEnlarge && " (can enlarge)"}
                          {facility.unique && " • Unique"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold mb-2">Available Orders</div>
                      <div className="flex flex-wrap gap-2">
                        {facility.orders.map((order) => (
                          <Badge key={order} variant="outline" className="capitalize">
                            {order}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold mb-2">Benefits</div>
                      <div className="space-y-1 text-sm">
                        {facility.benefits.basic && (
                          <div>
                            <span className="text-muted-foreground">Basic:</span> {facility.benefits.basic}
                          </div>
                        )}
                        {facility.benefits.advanced && (
                          <div>
                            <span className="text-muted-foreground">Advanced:</span> {facility.benefits.advanced}
                          </div>
                        )}
                        {facility.benefits.enhanced && (
                          <div>
                            <span className="text-muted-foreground">Enhanced:</span> {facility.benefits.enhanced}
                          </div>
                        )}
                        {facility.benefits.master && (
                          <div>
                            <span className="text-muted-foreground">Master:</span> {facility.benefits.master}
                          </div>
                        )}
                      </div>
                    </div>

                    {facility.companions && facility.companions.length > 0 && (
                      <div>
                        <div className="font-semibold mb-2">Available Companions</div>
                        <div className="flex flex-wrap gap-2">
                          {facility.companions.map((companionId) => {
                            const companion = COMPANION_DATA[companionId];
                            return companion ? (
                              <Badge key={companionId} variant="secondary">
                                {companion.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Order Types</CardTitle>
                <CardDescription>
                  Orders are actions your facilities perform each Bastion turn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(ORDER_SKILLS).map(([order, skills]) => (
                  <div key={order} className="border-b pb-4 last:border-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold capitalize text-lg">{order}</h3>
                      <Badge variant="outline">{skills.primary}</Badge>
                    </div>
                    {skills.alternatives.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Alternatives:</span> {skills.alternatives.join(", ")}
                      </div>
                    )}
                    <div className="mt-2 text-sm">
                      {order === 'maintain' && "No roll required. Refreshes all Charges and removes Damaged status from one facility."}
                      {order === 'trade' && "Earn Income based on facility tier. Critical success earns double income."}
                      {order === 'craft' && "Create items using Crafting skill. Requires materials and follows standard crafting rules."}
                      {order === 'empower' && "Activate facility's temporary benefit or boon for characters."}
                      {order === 'harvest' && "Gather resources from facilities like Gardens or Greenhouses."}
                      {order === 'recruit' && "Bring new defenders, creatures, or specialists to your Bastion."}
                      {order === 'research' && "Uncover information on chosen topics using facility resources."}
                      {order === 'scout' && "Gather intelligence on nearby regions, routes, or landmarks."}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Degrees of Success</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400">Critical Success</div>
                  <div className="text-sm text-muted-foreground">
                    Complete the order exceptionally. Gain listed benefits plus bonus at GM discretion. 
                    <strong> Also refreshes that facility's Charges.</strong>
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Success</div>
                  <div className="text-sm text-muted-foreground">
                    Accomplish the order as intended.
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-amber-600 dark:text-amber-400">Failure</div>
                  <div className="text-sm text-muted-foreground">
                    The order produces no results.
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-destructive">Critical Failure</div>
                  <div className="text-sm text-muted-foreground">
                    The order fails and causes the facility to be <strong>Damaged</strong>.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Companions Tab */}
          <TabsContent value="companions" className="space-y-6">
            <div className="grid gap-4">
              {filterCompanions().map((companion) => (
                <Card key={companion.id} data-testid={`card-companion-${companion.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="font-serif">{companion.name}</CardTitle>
                        <CardDescription>{companion.title}</CardDescription>
                      </div>
                      {companion.questRequired && (
                        <Badge variant="secondary">Quest Required</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm font-semibold mb-1">Facility Assignment</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {companion.facility}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1">Bonus</div>
                      <div className="text-sm text-muted-foreground">{companion.bonus}</div>
                    </div>
                    {companion.questRequired && companion.questName && (
                      <div className="border-t pt-3">
                        <div className="text-sm font-semibold mb-1">Quest: {companion.questName}</div>
                        <div className="text-sm text-muted-foreground">
                          {companion.questDescription}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Mechanics Tab */}
          <TabsContent value="mechanics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Bastion Boons</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  A character can benefit from only <strong>one Bastion Boon at a time</strong>.
                </p>
                <ul>
                  <li>Each facility has Charges (1 at Basic, 2 at Advanced, 3 at Master)</li>
                  <li>Spend 1 Charge to grant that facility's boon to a character</li>
                  <li>Charges refresh when you Maintain or critically succeed on that facility's Order</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Facility Construction</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h4>Fixed Cost System</h4>
                <ul>
                  <li><strong>Cramped (4 squares):</strong> 300 gp</li>
                  <li><strong>Roomy (16 squares):</strong> 800 gp</li>
                  <li><strong>Vast (36 squares):</strong> 2,500 gp</li>
                </ul>
                <p>
                  Facilities cost the same regardless of your level. Construction takes 1 Bastion turn.
                  Upgrades to higher tiers happen automatically at appropriate levels.
                </p>
                <h4>Enlargement Costs</h4>
                <ul>
                  <li><strong>Cramped → Roomy:</strong> 500 gp</li>
                  <li><strong>Roomy → Vast:</strong> 1,700 gp</li>
                  <li><strong>Cramped → Vast:</strong> 2,200 gp</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Defensive Walls</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <ul>
                  <li><strong>Cost:</strong> 20 gp per 5-foot section (+5 gp for walkway)</li>
                  <li><strong>Time:</strong> 5 days per 50-foot length</li>
                  <li><strong>Benefit:</strong> If completely enclosed, reduce casualty dice by 2 (minimum 2 dice)</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progression Tab */}
          <TabsContent value="progression" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Facility Acquisition & Upgrades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="font-semibold mb-2">Level 5 (Start)</div>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>2 basic facilities (one Cramped, one Roomy) - Free</li>
                      <li>2 special facilities of your choice - Free</li>
                      <li>0 Bastion Defenders initially</li>
                    </ul>
                  </div>
                  <div className="border-b pb-4">
                    <div className="font-semibold mb-2">Level 7</div>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>All facilities advance to Advanced tier</li>
                      <li>DC increases to 22, Charges increase to 2</li>
                    </ul>
                  </div>
                  <div className="border-b pb-4">
                    <div className="font-semibold mb-2">Level 9</div>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Gain 1 new special facility (pay standard cost)</li>
                      <li>Income cap increases to 100 gp/turn</li>
                    </ul>
                  </div>
                  <div className="border-b pb-4">
                    <div className="font-semibold mb-2">Level 11</div>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>All facilities advance to Enhanced tier</li>
                      <li>DC increases to 28</li>
                    </ul>
                  </div>
                  <div className="border-b pb-4">
                    <div className="font-semibold mb-2">Level 13</div>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Gain 1 new special facility (pay standard cost)</li>
                      <li>Income cap increases to 150 gp/turn</li>
                      <li>Some facilities can upgrade (Library → Archive, etc.)</li>
                    </ul>
                  </div>
                  <div className="border-b pb-4">
                    <div className="font-semibold mb-2">Level 15</div>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>All facilities advance to Master tier</li>
                      <li>DC increases to 34, Charges remain at 3</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Level 17</div>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Gain 1 new special facility (pay standard cost)</li>
                      <li>Income cap increases to 250 gp/turn</li>
                      <li>Access to legendary facilities (Demiplane, Guildhall)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
