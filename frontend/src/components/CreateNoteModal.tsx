import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import api from "../lib/axios";
import type { Note } from "../lib/types";
import RichTextEditor from "./RichTextEditor";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteCreated: (note: Note) => void;
}

const COLOR_PRESETS = [
  { label: "Default", value: "#ffffff" },
  { label: "Yellow", value: "#fef3c7" },
  { label: "Green", value: "#dcfce7" },
  { label: "Blue", value: "#e0e7ff" },
  { label: "Pink", value: "#fce7f3" },
];

export default function CreateNoteModal({
  isOpen,
  onClose,
  onNoteCreated,
}: CreateNoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentRich, setContentRich] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/notes", {
        title: title.trim(),
        content: content.trim() || undefined,
        content_rich: contentRich.trim() || undefined,
        color: color || undefined,
      });

      const newNote = response.data.data;
      onNoteCreated(newNote);
      setTitle("");
      setContent("");
      setContentRich("");
      setColor("#ffffff");
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.errors?.[0]?.msg ||
            "Failed to create note."
        );
      } else {
        setError("Failed to create note.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Note</h2>
          <button type="button" className="modal-close" onClick={onClose} style={{ display: "flex", alignItems: "center" }}>
            <X size={18} />
          </button>
        </div>

        {error && <div className="auth-alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="note-form">
          <div className="form-group">
            <label className="form-label" htmlFor="new-note-title">
              Title
            </label>
            <input
              id="new-note-title"
              type="text"
              className="form-input"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <RichTextEditor
              content={contentRich}
              onChange={(html, text) => {
                setContentRich(html);
                setContent(text);
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Note Color</label>
            <div className="color-options">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  className={`color-radio ${color === preset.value ? "selected" : ""}`}
                  style={{
                    backgroundColor: preset.value,
                    border: color === preset.value ? "2px solid #2563eb" : "1px solid #cbd5e1",
                  }}
                  title={preset.label}
                  onClick={() => setColor(preset.value)}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
