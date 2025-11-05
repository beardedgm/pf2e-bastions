import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBastionSchema, insertFacilitySchema, insertTurnSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Bastion routes
  app.get("/api/bastions", async (_req, res) => {
    try {
      const bastions = await storage.getBastions();
      res.json(bastions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bastions" });
    }
  });

  app.get("/api/bastions/:id", async (req, res) => {
    try {
      const bastion = await storage.getBastion(req.params.id);
      if (!bastion) {
        return res.status(404).json({ error: "Bastion not found" });
      }
      res.json(bastion);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bastion" });
    }
  });

  app.post("/api/bastions", async (req, res) => {
    try {
      const result = insertBastionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid bastion data", details: result.error });
      }
      const bastion = await storage.createBastion(result.data);
      res.status(201).json(bastion);
    } catch (error) {
      res.status(500).json({ error: "Failed to create bastion" });
    }
  });

  app.patch("/api/bastions/:id", async (req, res) => {
    try {
      const bastion = await storage.updateBastion(req.params.id, req.body);
      if (!bastion) {
        return res.status(404).json({ error: "Bastion not found" });
      }
      res.json(bastion);
    } catch (error) {
      res.status(500).json({ error: "Failed to update bastion" });
    }
  });

  app.delete("/api/bastions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBastion(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Bastion not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete bastion" });
    }
  });

  // Facility routes
  app.get("/api/bastions/:bastionId/facilities", async (req, res) => {
    try {
      const facilities = await storage.getFacilitiesByBastion(req.params.bastionId);
      res.json(facilities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch facilities" });
    }
  });

  app.get("/api/facilities/:id", async (req, res) => {
    try {
      const facility = await storage.getFacility(req.params.id);
      if (!facility) {
        return res.status(404).json({ error: "Facility not found" });
      }
      res.json(facility);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch facility" });
    }
  });

  app.post("/api/facilities", async (req, res) => {
    try {
      const result = insertFacilitySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid facility data", details: result.error });
      }
      const facility = await storage.createFacility(result.data);
      res.status(201).json(facility);
    } catch (error) {
      res.status(500).json({ error: "Failed to create facility" });
    }
  });

  app.patch("/api/facilities/:id", async (req, res) => {
    try {
      const facility = await storage.updateFacility(req.params.id, req.body);
      if (!facility) {
        return res.status(404).json({ error: "Facility not found" });
      }
      res.json(facility);
    } catch (error) {
      res.status(500).json({ error: "Failed to update facility" });
    }
  });

  app.delete("/api/facilities/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFacility(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Facility not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete facility" });
    }
  });

  // Turn routes
  app.get("/api/bastions/:bastionId/turns", async (req, res) => {
    try {
      const turns = await storage.getTurnsByBastion(req.params.bastionId);
      res.json(turns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch turns" });
    }
  });

  app.get("/api/turns/:id", async (req, res) => {
    try {
      const turn = await storage.getTurn(req.params.id);
      if (!turn) {
        return res.status(404).json({ error: "Turn not found" });
      }
      res.json(turn);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch turn" });
    }
  });

  app.post("/api/turns", async (req, res) => {
    try {
      const result = insertTurnSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid turn data", details: result.error });
      }
      const turn = await storage.createTurn(result.data);
      res.status(201).json(turn);
    } catch (error) {
      res.status(500).json({ error: "Failed to create turn" });
    }
  });

  app.patch("/api/turns/:id", async (req, res) => {
    try {
      const turn = await storage.updateTurn(req.params.id, req.body);
      if (!turn) {
        return res.status(404).json({ error: "Turn not found" });
      }
      res.json(turn);
    } catch (error) {
      res.status(500).json({ error: "Failed to update turn" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
