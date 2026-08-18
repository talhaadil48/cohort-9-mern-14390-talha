import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NoteDetail from "./pages/NoteDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes" element={<Dashboard />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;