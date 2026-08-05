const db = require("../config/db");

const createNote = async (noteData) => {
    const { user_id, title, content, content_rich, color } = noteData;
    const query = `
        INSERT INTO notes (user_id, title, content, content_rich, color)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const result = await db.query(query, [
        user_id,
        title,
        content,
        content_rich,
        color
    ]);
    return result.rows[0];
};


const getAllNotes = async (user_id) => {
    const query = `
        SELECT * FROM notes 
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;
    const result = await db.query(query, [user_id]);
    return result.rows;
}

const getNotesById = async (note_id, user_id) => {
    const query = `
        SELECT * FROM notes 
        WHERE id = $1 AND user_id = $2
    `;
    const result = await db.query(query, [note_id, user_id]);
    return result.rows[0];
}

const updateNote = async (note_id, user_id, noteData) => {
    const { title, content, content_rich, color } = noteData;
    const query = `
        UPDATE notes
        SET title = COALESCE($1, title),
            content = COALESCE($2, content),
            content_rich = COALESCE($3, content_rich),
            color = COALESCE($4, color)
        WHERE id = $5 AND user_id = $6
        RETURNING *
    `;
    const result = await db.query(query, [title, content, content_rich, color, note_id, user_id]);
    return result.rows[0];
}



const softDeleteNote = async (note_id, user_id) => {
    const query = `
        UPDATE notes
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND user_id = $2
    `;
    await db.query(query, [note_id, user_id]);
};

const changeArchiveStatus = async (note_id, user_id,noteData) => {
    const is_archived = noteData.is_archived; 
    const query = `
        UPDATE notes
        SET is_archived = $3
        WHERE id = $1 AND user_id = $2
        RETURNING *
    `;
    const result = await db.query(query, [note_id, user_id, is_archived]);
    return result.rows[0];


}

const changePinnedStatus = async (note_id, user_id,noteData) => {
    const is_pinned = noteData.is_pinned; 
    const query = `
        UPDATE notes
        SET is_pinned = $3
        WHERE id = $1 AND user_id = $2  
    RETURNING *
    `;
    const result = await db.query(query, [note_id, user_id, is_pinned]);
    return result.rows[0];
}

const restoreNote = async (note_id, user_id) => {
    const query = `
        UPDATE notes
        SET deleted_at = NULL
        WHERE id = $1 AND user_id = $2
        RETURNING *
    `;
    const result = await db.query(query, [note_id, user_id]);
    return result.rows[0];
}


const emptyRecycledNotes = async (user_id) => {
    const query = `
        DELETE FROM notes
        WHERE user_id = $1 AND deleted_at IS NOT NULL
    `;
    await db.query(query, [user_id]);
}

module.exports = { createNote, getAllNotes, getNotesById, updateNote, softDeleteNote, changeArchiveStatus , changePinnedStatus ,restoreNote, emptyRecycledNotes};
