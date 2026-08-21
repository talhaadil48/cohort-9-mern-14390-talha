import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import ProtectedRoute from "../components/ProtectedRoute";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to home if no access token", () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/" element={<div>Public Home</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Secret Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Public Home")).toBeInTheDocument();
    expect(screen.queryByText("Secret Dashboard")).not.toBeInTheDocument();
  });

  it("renders protected content if access token exists", () => {
    (Cookies.get as jest.Mock).mockReturnValue("fake-jwt-token");

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/" element={<div>Public Home</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Secret Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Secret Dashboard")).toBeInTheDocument();
  });
});
