import mongoose, { Schema, Types, isValidObjectId } from "mongoose";
import note from "../modals/note.js";

// Get specific note by its Id

export const getnote = async (req, res) => {
  const { noteId } = req.params;

  if (!noteId) {
    return res.status(400).send({ error: "Unable to get noteId" });
  }

  if (!mongoose.isValidObjectId(noteId)) {
    return res.status(400).send({ error: "Invalid  type of noteId" });
  }

  try {
    const Note = await note.findById({ _id: noteId });

    if (!Note) {
      return res.status(404).send({ message: `Note not found ` });
    }

    return res.status(200).json({ note: Note, message: `success` });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error ", error: error.message });
  }
};

export const getnotes = async (req, res) => {
  try {
    const notes = await note.find();

    return res.status(200).json({ notes: notes, message: "success" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server Error", error: error.message });
  }
};

export const addNote = async (req, res) => {
  const userId = await req.user.id;
  if (!userId) {
    return res.status(401).send({ error: "Unauthenticated" });
  }
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send({ error: "Invalid  type of usedId" });
  }

  const { title, content, tag } = req.body;

  if (!title || !content) {
    return res.status(404).send({ error: "provide required fields" });
  }

  try {
    const newNote = await note.create({
      title: title,
      content: content,
      tag: tag,
      user: userId,
    });

    await newNote.save();

    return res
      .status(200)
      .json({ message: "new note added successfully", newNote: newNote });
  } catch (error) {
    console.log("error", error.message);
    return res
      .status(500)
      .send({ message: "Internal server error ", error: error.message });
  }
};

export const deletenote = async (req, res) => {
  const userId = req.user.id;

  const { id } = req.params;

  if (!userId) {
    return res.status(401).send({ error: "Unauthenticated" });
  }

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send({ error: "Invalid  type of usedId" });
  }
  if (!id) {
    return res.status(404).send({ error: "Note not found" });
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid  type of noteId" });
  }

  try {
    await note.deleteOne({ _id: id }).where({ user: userId });

    return res.status(200).send({ message: "Note deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Internal server error ", error: error.message });
  }
};

export const updatenote = async (req, res) => {
  const userId = req.user.id;

  const { id } = req.params;

  const { title, content, tag } = req.body;

  if ((title && title?.length > 10) || (tag && tag?.length > 5)) {
    return res.status(400).send({
      error:
        "title and tag length must be less that 10 and 5 characters respectively",
    });
  }

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send({ error: "Invalid  type of usedId" });
  }

  if (!userId) {
    return res.status(401).send({ error: "Unauthenticated" });
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid  type of noteId" });
  }

  if (!id) {
    return res.status(404).send({ error: "unable to get Id" });
  }

  if (!title && !content && !tag) {
    return res.status(404).send({ error: "Nothing to update" });
  }

  try {
    const upatedNote = await note.findOne({ _id: id });

    if (!upatedNote) {
      return res.status(400).send({ error: "Note not found" });
    }

    let updateObject = {};
    if (title) updateObject.title = title;
    if (content) updateObject.content = content;
    if (tag) updateObject.tag = tag;

    const Updatednote = await note
      .findByIdAndUpdate({ _id: id }, updateObject, { new: true })
      .where({ user: userId });

    return res
      .status(200)
      .json({ message: "Note updated successfully", updatedNote: Updatednote });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server Error", error: error.message });
  }
};
