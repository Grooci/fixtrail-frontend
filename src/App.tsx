import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerHome from "./pages/CustomerHome";
import ProviderHome from "./pages/ProviderHome";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute role="customer" />}>
          <Route path="/customer" element={<CustomerHome />} />
        </Route>

        <Route element={<ProtectedRoute role="provider" />}>
          <Route path="/provider" element={<ProviderHome />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}