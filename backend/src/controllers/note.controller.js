const noteModel = require("../models/note.model");
const logger = require("../utils/logger");

const createNote = async (req, res, next) => {
    try {
        const { title, content, content_rich, color } = req.body;
        const user_id = req.user.id;
        const newNote = await noteModel.createNote({ user_id, title, content, content_rich, color });
        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: newNote
        });
    } catch (error) {
        logger.error({ err: error }, "Error creating note");
        next(error);
    }
};

const getAllNotes = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const notes = await noteModel.getAllNotes(user_id);
        res.status(200).json({
            success: true,
            message: "Notes retrieved successfully",
            data: notes
        });
    } catch (error) {
        logger.error({ err: error }, "Error retrieving notes");
        next(error);
    }
};

const getNoteById = async (req, res, next) => {
    try {
        const { note_id } = req.params;
        const user_id = req.user.id;
        const note = await noteModel.getNotesById(note_id, user_id);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Note retrieved successfully",
                data: note
            });
        }
    } catch (error) {
        logger.error({ err: error }, "Error retrieving note");
        next(error);
    }
};

const updateNote = async (req, res, next) => {
    try {
        const { note_id } = req.params;
        const user_id = req.user.id;
        const { title, content, content_rich, color } = req.body;
        const note = await noteModel.getNotesById(note_id, user_id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        } else {
            const updatedNote = await noteModel.updateNote(note_id, user_id, { title, content, content_rich, color });

            res.status(200).json({
                success: true,
                message: "Note updated successfully",
                data: updatedNote
            });
        }
    } catch (error) {
        logger.error({ err: error }, "Error updating note");
        next(error);
    }
};

const softDeleteNote = async (req, res, next) => {
    try {
        const { note_id } = req.params;
        const user_id = req.user.id;
        const note = await noteModel.getNotesById(note_id, user_id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        } else {
            await noteModel.softDeleteNote(note_id, user_id);
            return res.status(200).json({
                success: true,
                message: "Note deleted successfully"
            });
        }
    } catch (error) {
        logger.error({ err: error }, "Error deleting note");
        next(error);
    }
};

const changeArchiveStatus = async (req, res, next) => {
    try {
        const { note_id } = req.params;
        const user_id = req.user.id;
        const { is_archived } = req.body;

        const note = await noteModel.getNotesById(note_id, user_id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        const updatedNote = await noteModel.changeArchiveStatus(
            note_id,
            user_id,
            { is_archived }
        );

        return res.status(200).json({
            success: true,
            message: "Note archive status updated successfully",
            data: updatedNote
        });

    } catch (error) {
        logger.error({ err: error }, "Error updating note archive status");
        next(error);
    }
};

const changePinnedStatus = async (req, res, next) => {
    try {
        const { note_id } = req.params;
        const user_id = req.user.id;
        const { is_pinned } = req.body;

        const note = await noteModel.getNotesById(note_id, user_id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        const updatedNote = await noteModel.changePinnedStatus(
            note_id,
            user_id,
            { is_pinned }
        );

        return res.status(200).json({
            success: true,
            message: "Note pinned status updated successfully",
            data: updatedNote
        });

    } catch (error) {
        logger.error({ err: error }, "Error updating note pinned status");
        next(error);
    }
};

const restoreNote = async (req, res, next) => {
    try {
        const { note_id } = req.params;
        const user_id = req.user.id;

        const note = await noteModel.getNotesById(note_id, user_id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        const restoredNote = await noteModel.restoreNote(note_id, user_id);

        return res.status(200).json({
            success: true,
            message: "Note restored successfully",
            data: restoredNote
        });

    } catch (error) {
        logger.error({ err: error }, "Error restoring note");
        next(error);
    }
};

const emptyRecycledNotes = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        await noteModel.emptyRecycledNotes(user_id);
        return res.status(200).json({
            success: true,
            message: "Recycled notes emptied successfully"
        });
    } catch (error) {
        logger.error({ err: error }, "Error emptying recycled notes");
        next(error);
    }
};

module.exports = { createNote, getAllNotes, getNoteById, updateNote, softDeleteNote, changeArchiveStatus, changePinnedStatus, restoreNote, emptyRecycledNotes };