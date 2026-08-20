import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Plus, Trash2, Pin, Search } from "lucide-react";
import api from "../lib/axios";
import type { Note } from "../lib/types";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import CreateNoteModal from "../components/CreateNoteModal";
import "../styles/notes.css";

type TabType = "all" | "pinned" | "archived" | "trash";

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTab, setCurrentTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadNotes = async () => {
      try {
        const response = await api.get("/notes");
        if (isMounted) {
          setNotes(response.data.data || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "Failed to load notes.");
          } else {
            setError("Failed to load notes.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTogglePin = async (note: Note) => {
    try {
      const response = await api.put(`/notes/${note.id}/pinned`, {
        is_pinned: !note.is_pinned,
      });
      const updated = response.data.data;
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, is_pinned: updated.is_pinned } : n))
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to update pin status.");
      } else {
        alert("Failed to update pin status.");
      }
    }
  };

  const handleToggleArchive = async (note: Note) => {
    try {
      const response = await api.put(`/notes/${note.id}/archive`, {
        is_archived: !note.is_archived,
      });
      const updated = response.data.data;
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, is_archived: updated.is_archived } : n))
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to update archive status.");
      } else {
        alert("Failed to update archive status.");
      }
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, deleted_at: new Date().toISOString() } : n))
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to delete note.");
      } else {
        alert("Failed to delete note.");
      }
    }
  };

  const handleRestoreNote = async (id: number) => {
    try {
      const response = await api.put(`/notes/${id}/restore`);
      const restored = response.data.data;
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, deleted_at: null, ...restored } : n))
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to restore note.");
      } else {
        alert("Failed to restore note.");
      }
    }
  };

  const handleEmptyTrash = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all notes in trash?")) return;
    try {
      await api.delete("/notes");
      setNotes((prev) => prev.filter((n) => !n.deleted_at));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to empty trash.");
      } else {
        alert("Failed to empty trash.");
      }
    }
  };

  const handleNoteCreated = (newNote: Note) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (currentTab === "trash") {
        return !!note.deleted_at;
      }

      if (note.deleted_at) {
        return false;
      }

      if (currentTab === "pinned") {
        return note.is_pinned && !note.is_archived;
      }

      if (currentTab === "archived") {
        return note.is_archived;
      }

      return !note.is_archived;
    });
  }, [notes, currentTab, searchQuery]);

  const pinnedNotes = useMemo(() => {
    if (currentTab !== "all") return [];
    return filteredNotes.filter((n) => n.is_pinned);
  }, [filteredNotes, currentTab]);

  const otherNotes = useMemo(() => {
    if (currentTab !== "all") return filteredNotes;
    return filteredNotes.filter((n) => !n.is_pinned);
  }, [filteredNotes, currentTab]);

  return (
    <div className="notes-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">My Notes</h1>
          <div className="header-actions">
            {currentTab === "trash" ? (
              <button
                type="button"
                className="btn-danger"
                onClick={handleEmptyTrash}
                disabled={!notes.some((n) => n.deleted_at)}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Trash2 size={16} />
                Empty Trash
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsModalOpen(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Plus size={16} />
                New Note
              </button>
            )}
          </div>
        </div>

        <div style={{ position: "relative", maxWidth: "340px", marginBottom: "16px" }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: "34px" }}
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            type="button"
            className={`tab-btn ${currentTab === "all" ? "active" : ""}`}
            onClick={() => setCurrentTab("all")}
          >
            All Notes
          </button>
          <button
            type="button"
            className={`tab-btn ${currentTab === "pinned" ? "active" : ""}`}
            onClick={() => setCurrentTab("pinned")}
          >
            Pinned
          </button>
          <button
            type="button"
            className={`tab-btn ${currentTab === "archived" ? "active" : ""}`}
            onClick={() => setCurrentTab("archived")}
          >
            Archived
          </button>
          <button
            type="button"
            className={`tab-btn ${currentTab === "trash" ? "active" : ""}`}
            onClick={() => setCurrentTab("trash")}
          >
            Trash
          </button>
        </div>

        {error && <div className="auth-alert alert-error">{error}</div>}

        {loading ? (
          <div className="empty-state">
            <p>Loading your notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <h3>No notes found</h3>
            <p>
              {searchQuery
                ? "No notes matched your search query."
                : currentTab === "pinned"
                ? "You haven't pinned any notes yet."
                : currentTab === "archived"
                ? "No archived notes."
                : currentTab === "trash"
                ? "Trash is empty."
                : "Get started by creating your first note!"}
            </p>
            {currentTab === "all" && !searchQuery && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsModalOpen(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Plus size={16} />
                Create Note
              </button>
            )}
          </div>
        ) : (
          <>
            {currentTab === "all" && pinnedNotes.length > 0 && (
              <>
                <div className="section-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Pin size={14} color="#2563eb" fill="#2563eb" />
                  Pinned Notes
                </div>
                <div className="notes-grid">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onTogglePin={handleTogglePin}
                      onToggleArchive={handleToggleArchive}
                      onDelete={handleDeleteNote}
                      onRestore={handleRestoreNote}
                    />
                  ))}
                </div>

                {otherNotes.length > 0 && <div className="section-title">Other Notes</div>}
              </>
            )}

            <div className="notes-grid">
              {otherNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onTogglePin={handleTogglePin}
                  onToggleArchive={handleToggleArchive}
                  onDelete={handleDeleteNote}
                  onRestore={handleRestoreNote}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNoteCreated={handleNoteCreated}
      />
    </div>
  );
}