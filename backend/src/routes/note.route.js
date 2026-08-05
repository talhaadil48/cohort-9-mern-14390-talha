const express = require("express");
const router = express.Router();

const noteController = require("../controllers/note.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const {
    noteValidation,
    noteUpdateValidation,
    archiveStatusValidation,
    pinnedStatusValidation,
    noteIdValidation
} = require("../middleware/validate.middleware");



/**
 * @swagger
 * tags:
 *   name: Note
 *   description: CRUD operations for notes
 */


/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Note
 *               content:
 *                 type: string
 *                 example: This is my note content
 *               content_rich:
 *                 type: string
 *                 example: "<p>This is rich content</p>"
 *               color:
 *                 type: string
 *                 example: "#ff0000"
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post("/", authenticateToken, noteValidation, noteController.createNote);


/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", authenticateToken,noteIdValidation ,noteController.getAllNotes);


/**
 * @swagger
 * /api/notes/{note_id}:
 *   get:
 *     summary: Get a note by ID
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note retrieved successfully
 *       404:
 *         description: Note not found
 *       500:
 *         description: Server error
 */
router.get("/:note_id", authenticateToken, noteIdValidation, noteController.getNoteById);


/**
 * @swagger
 * /api/notes/{note_id}:
 *   put:
 *     summary: Update a note by ID
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated note title
 *               content:
 *                 type: string
 *                 example: Updated note content
 *               content_rich:
 *                 type: string
 *                 example: "<p>Updated rich content</p>"
 *               color:
 *                 type: string
 *                 example: "#FFFFFF"
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Note not found
 *       500:
 *         description: Server error
 */
router.put("/:note_id", authenticateToken, noteIdValidation, noteUpdateValidation, noteController.updateNote);


/**
 * @swagger
 * /api/notes/{note_id}:
 *   delete:
 *     summary: Soft delete a note by ID
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note soft deleted successfully
 *       404:
 *         description: Note not found
 *       500:
 *         description: Server error
 */
router.delete("/:note_id", authenticateToken, noteIdValidation, noteController.softDeleteNote);



/**
 * @swagger
 * /api/notes/{note_id}/restore:
 *   put:
 *     summary: Restore a soft-deleted note by ID
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note restored   successfully
 *       404:
 *         description: Note not found
 *       500:
 *         description: Server error
 */
router.put("/:note_id/restore", authenticateToken, noteIdValidation, noteController.restoreNote);




/**
 * @swagger
 * /api/notes/{note_id}/archive:
 *   put:
 *     summary: Update note archive status
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_archived
 *             properties:
 *               is_archived:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Archive status updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Note not found
 *       500:
 *         description: Server error
 */
router.put(
    "/:note_id/archive",
    authenticateToken,
    archiveStatusValidation,
    noteIdValidation,
    noteController.changeArchiveStatus
);


/**
 * @swagger
 * /api/notes/{note_id}/pinned:
 *   put:
 *     summary: Update note pinned status
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_pinned
 *             properties:
 *               is_pinned:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Pinned status updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Note not found
 *       500:
 *         description: Server error
 */
router.put(
    "/:note_id/pinned",
    authenticateToken,
    pinnedStatusValidation,
    noteIdValidation,
    noteController.changePinnedStatus
);

/**
 * @swagger
 * /api/notes/:
 *   delete:
 *     summary: Empty recycled notes
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recycled notes emptied successfully
 *       500:
 *         description: Server error
 */
router.delete("/", authenticateToken, noteController.emptyRecycledNotes);

module.exports = router;