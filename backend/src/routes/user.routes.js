import express from "express";
import {
  fetchAndStore,
  listUsers,
  editUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/fetch", fetchAndStore);
router.get("/", listUsers);
router.put("/:uuid", editUser);

export default router;
