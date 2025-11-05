import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Facility sizes and costs
export const FACILITY_SIZES = {
  cramped: { squares: 4, cost: 300 },
  roomy: { squares: 16, cost: 800 },
  vast: { squares: 36, cost: 2500 },
} as const;

export type FacilitySize = keyof typeof FACILITY_SIZES;

// Facility tiers by character level
export const FACILITY_TIERS = {
  basic: { minLevel: 5, dc: 16, taskLevel: 1, charges: 1 },
  advanced: { minLevel: 7, dc: 22, taskLevel: 5, charges: 2 },
  enhanced: { minLevel: 11, dc: 28, taskLevel: 9, charges: 3 },
  master: { minLevel: 15, dc: 34, taskLevel: 13, charges: 3 },
} as const;

export type FacilityTier = keyof typeof FACILITY_TIERS;

// Income caps by level
export const INCOME_CAPS = {
  5: 50,
  9: 100,
  13: 150,
  17: 250,
} as const;

// Order types
export type OrderType = 
  | 'maintain'
  | 'trade'
  | 'craft'
  | 'empower'
  | 'harvest'
  | 'recruit'
  | 'research'
  | 'scout';

// Database tables
export const bastions = pgTable("bastions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  characterLevel: integer("character_level").notNull().default(5),
  gold: integer("gold").notNull().default(0),
  defenders: integer("defenders").notNull().default(0),
  bankedTurns: integer("banked_turns").notNull().default(0),
  totalTurns: integer("total_turns").notNull().default(0),
  description: text("description"),
});

export const facilities = pgTable("facilities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bastionId: varchar("bastion_id").notNull(),
  facilityType: text("facility_type").notNull(), // e.g., "arcane_study", "armory"
  name: text("name").notNull(),
  size: text("size").notNull(), // cramped, roomy, vast
  charges: integer("charges").notNull().default(1),
  damaged: boolean("damaged").notNull().default(false),
  currentOrder: text("current_order"), // active order type
  companionId: text("companion_id"), // assigned companion
  notes: text("notes"),
});

export const turns = pgTable("turns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bastionId: varchar("bastion_id").notNull(),
  turnNumber: integer("turn_number").notNull(),
  bankedTurns: integer("banked_turns").notNull().default(0),
  absentTurns: integer("absent_turns").notNull().default(0),
  autoMaintain: boolean("auto_maintain").notNull().default(false),
  orders: jsonb("orders"), // array of orders executed (optional for tracking turns)
  income: integer("income").notNull().default(0),
  events: jsonb("events"), // array of event resolutions
  notes: text("notes"),
});

// Zod schemas for validation
export const insertBastionSchema = createInsertSchema(bastions).omit({
  id: true,
});

export const insertFacilitySchema = createInsertSchema(facilities).omit({
  id: true,
});

export const insertTurnSchema = createInsertSchema(turns).omit({
  id: true,
});

// TypeScript types
export type Bastion = typeof bastions.$inferSelect;
export type InsertBastion = z.infer<typeof insertBastionSchema>;

export type Facility = typeof facilities.$inferSelect;
export type InsertFacility = z.infer<typeof insertFacilitySchema>;

export type Turn = typeof turns.$inferSelect;
export type InsertTurn = z.infer<typeof insertTurnSchema>;

// Facility data structure
export interface FacilityData {
  id: string;
  name: string;
  category: 'combat' | 'crafting' | 'magic' | 'social' | 'resource' | 'advanced';
  minLevel: number;
  prerequisite: string;
  defaultSize: FacilitySize;
  canEnlarge: boolean;
  unique: boolean;
  description: string;
  orders: string[];
  benefits: {
    basic: string;
    advanced?: string;
    enhanced?: string;
    master?: string;
  };
  companions?: string[];
}

// Companion data structure
export interface CompanionData {
  id: string;
  name: string;
  title: string;
  facility: string;
  bonus: string;
  questRequired: boolean;
  questName?: string;
  questDescription?: string;
}

// Order result
export interface OrderResult {
  success: boolean;
  criticalSuccess: boolean;
  failure: boolean;
  criticalFailure: boolean;
  result: string;
  incomeEarned?: number;
  defendersGained?: number;
  chargesRefreshed?: boolean;
}
