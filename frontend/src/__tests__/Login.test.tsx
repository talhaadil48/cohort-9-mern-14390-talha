import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Cookies from "js-cookie";
import Login from "../pages/Login";
import api from "../lib/axios";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("js-cookie", () => ({
  set: jest.fn(),
  get: jest.fn(),
  remove: jest.fn(),
}));

jest.mock("../lib/axios", () => ({
  post: jest.fn(),
}));

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form fields and submit button", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText("Username or Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    const mockUserData = { id: 1, email: "user@example.com", username: "user" };
    const mockTokens = { accessToken: "acc-token", refreshToken: "ref-token" };

    (api.post as jest.Mock).mockResolvedValueOnce({
      data: {
        tokens: mockTokens,
        user: mockUserData,
        message: "Login successful!",
      },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Username or Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        login: "user@example.com",
        password: "password123",
      });
      expect(Cookies.set).toHaveBeenCalledWith("access_token", "acc-token", { expires: 1 });
      expect(Cookies.set).toHaveBeenCalledWith("refresh_token", "ref-token", { expires: 7 });
    });
  });

  it("displays error message on invalid credentials", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        data: { message: "Invalid credentials" },
      },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Username or Email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
