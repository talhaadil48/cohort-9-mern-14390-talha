import React from "react";
import { Link } from "react-router-dom";
import {
  Pin,
  PinOff,
  Archive,
  ArchiveRestore,
  Pencil,
  Trash2,
  RotateCcw,
} from "lucide-react";
import type { Note } from "../lib/types";

interface NoteCardProps {
  note: Note;
  onTogglePin: (note: Note) => void;
  onToggleArchive: (note: Note) => void;
  onDelete: (id: number) => void;
  onRestore?: (id: number) => void;
}

export default function NoteCard({
  note,
  onTogglePin,
  onToggleArchive,
  onDelete,
  onRestore,
}: NoteCardProps) {
  const formattedDate = new Date(note.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const cardStyle: React.CSSProperties = {
    backgroundColor: note.color ? note.color : "#ffffff",
  };

  return (
    <div className="note-card" style={cardStyle}>
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>
        {!note.deleted_at && (
          <button
            type="button"
            className={`pin-btn ${note.is_pinned ? "pinned" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note);
            }}
            title={note.is_pinned ? "Unpin note" : "Pin note"}
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            {note.is_pinned ? (
              <Pin size={16} fill="#2563eb" color="#2563eb" />
            ) : (
              <PinOff size={16} />
            )}
          </button>
        )}
      </div>

      <Link
        to={`/notes/${note.id}`}
        style={{ textDecoration: "none", color: "inherit", display: "block", flex: 1 }}
      >
        <div className="note-card-body">
          {note.content || "No content"}
        </div>
      </Link>

      <div className="note-card-footer">
        <span>{formattedDate}</span>
        <div className="note-actions">
          {note.deleted_at ? (
            onRestore && (
              <button
                type="button"
                className="icon-btn"
                onClick={() => onRestore(note.id)}
                title="Restore note"
                style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <RotateCcw size={13} />
                Restore
              </button>
            )
          ) : (
            <>
              <button
                type="button"
                className="icon-btn"
                onClick={() => onToggleArchive(note)}
                title={note.is_archived ? "Unarchive" : "Archive"}
                style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                {note.is_archived ? (
                  <>
                    <ArchiveRestore size={13} />
                    Unarchive
                  </>
                ) : (
                  <>
                    <Archive size={13} />
                    Archive
                  </>
                )}
              </button>
              <Link
                to={`/notes/${note.id}`}
                className="icon-btn"
                title="Edit note"
                style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <Pencil size={13} />
                Edit
              </Link>
              <button
                type="button"
                className="icon-btn danger"
                onClick={() => onDelete(note.id)}
                title="Delete note"
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
