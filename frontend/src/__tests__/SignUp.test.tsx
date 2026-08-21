import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Cookies from "js-cookie";
import SignUp from "../pages/SignUp";
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

describe("SignUp Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders sign up form inputs", () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password \*/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("submits registration successfully", async () => {
    const mockTokens = { accessToken: "access-123", refreshToken: "refresh-123" };
    const mockUser = { id: 2, username: "johndoe", email: "john@example.com" };

    (api.post as jest.Mock).mockResolvedValueOnce({
      data: {
        tokens: mockTokens,
        user: mockUser,
        message: "Account created successfully!",
      },
    });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/username \*/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/email \*/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password \*/i), {
      target: { value: "secret123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/register", {
        username: "johndoe",
        email: "john@example.com",
        password: "secret123",
      });
      expect(Cookies.set).toHaveBeenCalledWith("access_token", "access-123", { expires: 1 });
    });
  });

  it("displays error message if registration fails", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        data: { message: "Email already taken" },
      },
    });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/username \*/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/email \*/i), {
      target: { value: "taken@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password \*/i), {
      target: { value: "secret123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Email already taken")).toBeInTheDocument();
    });
  });
});
