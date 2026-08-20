import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Pin,
  PinOff,
  Archive,
  ArchiveRestore,
  Trash2,
  Save,
} from "lucide-react";
import api from "../lib/axios";
import type { Note } from "../lib/types";
import Navbar from "../components/Navbar";
import RichTextEditor from "../components/RichTextEditor";
import "../styles/notes.css";

const COLOR_PRESETS = [
  { label: "Default", value: "#ffffff" },
  { label: "Yellow", value: "#fef3c7" },
  { label: "Green", value: "#dcfce7" },
  { label: "Blue", value: "#e0e7ff" },
  { label: "Pink", value: "#fce7f3" },
];

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentRich, setContentRich] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [isPinned, setIsPinned] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchNote = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/notes/${id}`);
        const data: Note = response.data.data;
        if (!ignore) {
          setNote(data);
          setTitle(data.title || "");
          setContent(data.content || "");
          setContentRich(data.content_rich || data.content || "");
          setColor(data.color || "#ffffff");
          setIsPinned(data.is_pinned);
          setIsArchived(data.is_archived);
        }
      } catch (err: unknown) {
        if (!ignore) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "Failed to load note.");
          } else {
            setError("Failed to load note.");
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchNote();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put(`/notes/${id}`, {
        title: title.trim(),
        content: content.trim() || undefined,
        content_rich: contentRich.trim() || undefined,
        color: color || undefined,
      });

      const updated = response.data.data;
      setNote(updated);
      setSuccess("Note saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.errors?.[0]?.msg ||
            "Failed to save note."
        );
      } else {
        setError("Failed to save note.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePin = async () => {
    if (!id) return;
    try {
      const response = await api.put(`/notes/${id}/pinned`, {
        is_pinned: !isPinned,
      });
      setIsPinned(response.data.data.is_pinned);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to update pin status.");
      } else {
        alert("Failed to update pin status.");
      }
    }
  };

  const handleToggleArchive = async () => {
    if (!id) return;
    try {
      const response = await api.put(`/notes/${id}/archive`, {
        is_archived: !isArchived,
      });
      setIsArchived(response.data.data.is_archived);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to update archive status.");
      } else {
        alert("Failed to update archive status.");
      }
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to delete note.");
      } else {
        alert("Failed to delete note.");
      }
    }
  };

  if (loading) {
    return (
      <div className="notes-layout">
        <Navbar />
        <main className="main-content">
          <div className="empty-state">
            <p>Loading note details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="notes-layout">
        <Navbar />
        <main className="main-content">
          <div className="auth-alert alert-error">{error}</div>
          <Link
            to="/dashboard"
            className="btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ArrowLeft size={16} />
            Back to Notes
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="notes-layout">
      <Navbar />

      <main className="main-content">
        <div className="note-detail-header">
          <Link
            to="/dashboard"
            className="btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ArrowLeft size={16} />
            Back to Notes
          </Link>

          <div className="note-detail-actions">
            <button
              type="button"
              className={`btn-secondary ${isPinned ? "active" : ""}`}
              onClick={handleTogglePin}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              {isPinned ? (
                <>
                  <Pin size={14} fill="#2563eb" color="#2563eb" />
                  Pinned
                </>
              ) : (
                <>
                  <PinOff size={14} />
                  Pin
                </>
              )}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleToggleArchive}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              {isArchived ? (
                <>
                  <ArchiveRestore size={14} />
                  Unarchive
                </>
              ) : (
                <>
                  <Archive size={14} />
                  Archive
                </>
              )}
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>

        {error && <div className="auth-alert alert-error">{error}</div>}
        {success && <div className="auth-alert alert-success">{success}</div>}

        <div
          className="note-detail-card"
          style={{ backgroundColor: color || "#ffffff" }}
        >
          <form onSubmit={handleSave} className="note-form">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-note-title">
                Title
              </label>
              <input
                id="edit-note-title"
                type="text"
                className="form-input"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving}
                required
                maxLength={255}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rich Content</label>
              <RichTextEditor
                content={contentRich}
                onChange={(html, text) => {
                  setContentRich(html);
                  setContent(text);
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Card Color</label>
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

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
