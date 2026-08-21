import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  remove: jest.fn(),
}));

describe("Navbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders brand name", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText("NotesApp")).toBeInTheDocument();
  });

  it("displays logged in user full name", () => {
    (Cookies.get as jest.Mock).mockReturnValue(
      JSON.stringify({ full_name: "John Doe", email: "john@example.com" })
    );

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("handles logout click properly", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const logoutBtn = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutBtn);

    expect(Cookies.remove).toHaveBeenCalledWith("access_token");
    expect(Cookies.remove).toHaveBeenCalledWith("refresh_token");
    expect(Cookies.remove).toHaveBeenCalledWith("user");
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
