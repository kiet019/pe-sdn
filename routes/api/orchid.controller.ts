import express from "express";
import OrchidRepository from "../package/repository/orchid.repository.ts";
import { Orchid, orchidModel } from "../package/model/orchid.ts";
import { UserRepository } from "../package/repository/user.repository.ts";
import { User } from "../package/model/user.ts";

const orchidRouter = express.Router();
const orchidRepository = new OrchidRepository();
const userRepository = new UserRepository();

orchidRouter

  .post("/get-orchids-by-name", async (req, res) => {
    try {
      const { name } = req.body;
      const orchids = await orchidRepository.findOrchidByName(name);
      res.json(orchids);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })
  .get("/", async (req, res) => {
    try {
      const orchids = await orchidRepository.adminGetAllOrchids();
      res.json(orchids);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })
  .get("/:orchidId", async (req, res) => {
    const orchidId = req.params.orchidId;
    try {
      const orchid = await orchidRepository.getOrchidById(orchidId);
      if (orchid) {
        res.json(orchid);
      } else {
        res.status(404).json({ message: "Orchid not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })

  .post("/", async (req, res) => {
    try {
      const user = await userRepository.getAuthorization(req);
      const orchidData = req.body;
      const newOrchid = await orchidRepository.createOrchid(orchidData);
      res.json(newOrchid);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })

  // Cập nhật Orchid theo ID
  .put("/:orchidId", async (req, res) => {
    try {
      const user = await userRepository.getAuthorization(req);
      const updateData = req.body;
      const orchidId = req.params.orchidId;

      const updatedOrchid = await orchidRepository.updateOrchid(
        orchidId,
        updateData
      );
      if (updatedOrchid) {
        res.json(updatedOrchid);
      } else {
        res.status(404).json({ message: "Orchid not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })
  .delete(":orchidId", async (req, res) => {
    try {
      const user = await userRepository.getAuthorization(req);
      const orchidId = req.params.orchidId;

      const deleted = await orchidRepository.deleteOrchid(orchidId);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Orchid not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
export default orchidRouter;
