import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateNoteModal from "../components/CreateNoteModal";
import api from "../lib/axios";

jest.mock("../lib/axios", () => ({
  post: jest.fn(),
}));

jest.mock("../components/RichTextEditor", () => {
  return function MockEditor({ onChange }: { onChange: (html: string, text: string) => void }) {
    return (
      <textarea
        placeholder="Editor"
        onChange={(e) => onChange(`<p>${e.target.value}</p>`, e.target.value)}
      />
    );
  };
});

describe("CreateNoteModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onNoteCreated: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(<CreateNoteModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Create New Note")).not.toBeInTheDocument();
  });

  it("renders form elements when isOpen is true", () => {
    render(<CreateNoteModal {...defaultProps} />);
    expect(screen.getByText("Create New Note")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter note title...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Note" })).toBeInTheDocument();
  });

  it("submits form and calls onNoteCreated on success", async () => {
    const mockCreatedNote = {
      id: 101,
      title: "New Note",
      content: "Note content",
      color: "#ffffff",
    };

    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { data: mockCreatedNote },
    });

    render(<CreateNoteModal {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Enter note title..."), {
      target: { value: "New Note" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Note" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/notes",
        expect.objectContaining({
          title: "New Note",
        })
      );
      expect(defaultProps.onNoteCreated).toHaveBeenCalledWith(mockCreatedNote);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<CreateNoteModal {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
