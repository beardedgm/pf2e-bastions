import { 
  type Bastion, 
  type InsertBastion, 
  type Facility, 
  type InsertFacility,
  type Turn,
  type InsertTurn,
  bastions,
  facilities,
  turns,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Storage interface for Bastion management
export interface IStorage {
  // Bastion operations
  getBastion(id: string): Promise<Bastion | undefined>;
  getBastions(): Promise<Bastion[]>;
  createBastion(bastion: InsertBastion): Promise<Bastion>;
  updateBastion(id: string, bastion: Partial<Bastion>): Promise<Bastion | undefined>;
  deleteBastion(id: string): Promise<boolean>;

  // Facility operations
  getFacility(id: string): Promise<Facility | undefined>;
  getFacilitiesByBastion(bastionId: string): Promise<Facility[]>;
  createFacility(facility: InsertFacility): Promise<Facility>;
  updateFacility(id: string, facility: Partial<Facility>): Promise<Facility | undefined>;
  deleteFacility(id: string): Promise<boolean>;

  // Turn operations
  getTurn(id: string): Promise<Turn | undefined>;
  getTurnsByBastion(bastionId: string): Promise<Turn[]>;
  createTurn(turn: InsertTurn): Promise<Turn>;
  updateTurn(id: string, turn: Partial<Turn>): Promise<Turn | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Bastion operations
  async getBastion(id: string): Promise<Bastion | undefined> {
    const [bastion] = await db.select().from(bastions).where(eq(bastions.id, id));
    return bastion || undefined;
  }

  async getBastions(): Promise<Bastion[]> {
    return await db.select().from(bastions);
  }

  async createBastion(insertBastion: InsertBastion): Promise<Bastion> {
    const [bastion] = await db
      .insert(bastions)
      .values(insertBastion)
      .returning();
    return bastion;
  }

  async updateBastion(id: string, updates: Partial<Bastion>): Promise<Bastion | undefined> {
    const [bastion] = await db
      .update(bastions)
      .set(updates)
      .where(eq(bastions.id, id))
      .returning();
    return bastion || undefined;
  }

  async deleteBastion(id: string): Promise<boolean> {
    const result = await db.delete(bastions).where(eq(bastions.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Facility operations
  async getFacility(id: string): Promise<Facility | undefined> {
    const [facility] = await db.select().from(facilities).where(eq(facilities.id, id));
    return facility || undefined;
  }

  async getFacilitiesByBastion(bastionId: string): Promise<Facility[]> {
    return await db.select().from(facilities).where(eq(facilities.bastionId, bastionId));
  }

  async createFacility(insertFacility: InsertFacility): Promise<Facility> {
    const [facility] = await db
      .insert(facilities)
      .values(insertFacility)
      .returning();
    return facility;
  }

  async updateFacility(id: string, updates: Partial<Facility>): Promise<Facility | undefined> {
    const [facility] = await db
      .update(facilities)
      .set(updates)
      .where(eq(facilities.id, id))
      .returning();
    return facility || undefined;
  }

  async deleteFacility(id: string): Promise<boolean> {
    const result = await db.delete(facilities).where(eq(facilities.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Turn operations
  async getTurn(id: string): Promise<Turn | undefined> {
    const [turn] = await db.select().from(turns).where(eq(turns.id, id));
    return turn || undefined;
  }

  async getTurnsByBastion(bastionId: string): Promise<Turn[]> {
    return await db
      .select()
      .from(turns)
      .where(eq(turns.bastionId, bastionId))
      .orderBy(desc(turns.turnNumber));
  }

  async createTurn(insertTurn: InsertTurn): Promise<Turn> {
    const [turn] = await db
      .insert(turns)
      .values(insertTurn)
      .returning();
    return turn;
  }

  async updateTurn(id: string, updates: Partial<Turn>): Promise<Turn | undefined> {
    const [turn] = await db
      .update(turns)
      .set(updates)
      .where(eq(turns.id, id))
      .returning();
    return turn || undefined;
  }
}

export const storage = new DatabaseStorage();
