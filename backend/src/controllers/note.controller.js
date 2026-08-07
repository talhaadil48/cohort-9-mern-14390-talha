const noteModel = require("../models/note.model");


const createNote = async (req, res) => {
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
        console.error("Error creating note:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllNotes = async (req, res) => {
    try {
        const user_id = req.user.id;
        const notes = await noteModel.getAllNotes(user_id);
        res.status(200).json({
            success: true,
            message: "Notes retrieved successfully",
            data: notes
        });
    } catch (error) {
        console.error("Error retrieving notes:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const getNoteById = async (req, res) => {
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
        else {
            res.status(200).json({
                success: true,
                message: "Note retrieved successfully",
                data: note
            });
        }
    } catch (error) {
        console.error("Error retrieving note:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


const updateNote = async (req, res) => {
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
        console.error("Error updating note:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const softDeleteNote = async (req, res) => {
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
            const deletedNote = await noteModel.softDeleteNote(note_id, user_id);
            return res.status(200).json({
                success: true,
                message: "Note deleted successfully"
            });
        }
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


const changeArchiveStatus = async (req, res) => {
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
        console.error("Error updating note archive status:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const changePinnedStatus = async (req, res) => {
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
        console.error("Error updating note pinned status:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const restoreNote = async (req, res) => {
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
        console.error("Error restoring note:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const emptyRecycledNotes = async (req, res) => {
    try {
        const user_id = req.user.id;
        await noteModel.emptyRecycledNotes(user_id);
        return res.status(200).json({
            success: true,
            message: "Recycled notes emptied successfully"
        });
    } catch (error) {
        console.error("Error emptying recycled notes:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { createNote, getAllNotes, getNoteById, updateNote, softDeleteNote, changeArchiveStatus, changePinnedStatus, restoreNote, emptyRecycledNotes };