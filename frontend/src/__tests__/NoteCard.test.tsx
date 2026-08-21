import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import type { Note } from "../lib/types";

const mockNote: Note = {
  id: 1,
  user_id: 10,
  title: "Meeting Notes",
  content: "Discuss project deadline",
  content_rich: "<p>Discuss project deadline</p>",
  color: "#ffffff",
  is_pinned: false,
  is_archived: false,
  created_at: "2026-08-01T12:00:00Z",
  updated_at: "2026-08-01T12:00:00Z",
  deleted_at: null,
};

const renderComponent = (props: Partial<React.ComponentProps<typeof NoteCard>> = {}) => {
  const defaultProps = {
    note: mockNote,
    onTogglePin: jest.fn(),
    onToggleArchive: jest.fn(),
    onDelete: jest.fn(),
    ...props,
  };

  return {
    ...render(
      <BrowserRouter>
        <NoteCard {...defaultProps} />
      </BrowserRouter>
    ),
    props: defaultProps,
  };
};

describe("NoteCard", () => {
  it("renders note title and content", () => {
    renderComponent();
    expect(screen.getByText("Meeting Notes")).toBeInTheDocument();
    expect(screen.getByText("Discuss project deadline")).toBeInTheDocument();
  });

  it("calls onTogglePin when pin button is clicked", () => {
    const onTogglePin = jest.fn();
    renderComponent({ onTogglePin });

    const pinBtn = screen.getByTitle("Pin note");
    fireEvent.click(pinBtn);
    expect(onTogglePin).toHaveBeenCalledWith(mockNote);
  });

  it("calls onToggleArchive when archive button is clicked", () => {
    const onToggleArchive = jest.fn();
    renderComponent({ onToggleArchive });

    const archiveBtn = screen.getByTitle("Archive");
    fireEvent.click(archiveBtn);
    expect(onToggleArchive).toHaveBeenCalledWith(mockNote);
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = jest.fn();
    renderComponent({ onDelete });

    const deleteBtn = screen.getByTitle("Delete note");
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("shows restore button for deleted note", () => {
    const onRestore = jest.fn();
    const deletedNote = { ...mockNote, deleted_at: "2026-08-02T12:00:00Z" };
    renderComponent({ note: deletedNote, onRestore });

    const restoreBtn = screen.getByTitle("Restore note");
    fireEvent.click(restoreBtn);
    expect(onRestore).toHaveBeenCalledWith(1);
  });
});
