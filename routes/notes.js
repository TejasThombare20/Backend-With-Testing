import express from "express";
const router = express.Router();
import {
  addNote,
  deletenote,
  getnote,
  getnotes,
  updatenote,
} from "../controllers/notesController.js";
import middleware from "../Middleware.js/middleware.js";

router.post("/add",middleware ,addNote);
router.get("/getnote/:noteId", getnote);
router.get("/getnotes", getnotes);
router.put("/update/:id",middleware, updatenote);
router.delete("/delete/:id",middleware, deletenote);

export default router;
