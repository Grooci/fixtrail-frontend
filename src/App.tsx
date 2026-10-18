import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerHome from "./pages/CustomerHome";
import ProviderHome from "./pages/ProviderHome";
import Categories from "./pages/Categories";
import Providers from "./pages/Providers";
import NewRequest from "./pages/NewRequest";
import MyRequests from "./pages/MyRequests";
import BrowseRequests from "./pages/BrowseRequests";
import MyJobs from "./pages/MyJobs";
import ProviderSetup from "./pages/ProviderSetup";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route element={<ProtectedRoute role="customer" />}>
              <Route path="/customer" element={<CustomerHome />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/providers" element={<Providers />} />
              <Route path="/requests/new" element={<NewRequest />} />
              <Route path="/requests" element={<MyRequests />} />
            </Route>

            <Route element={<ProtectedRoute role="provider" />}>
              <Route path="/provider" element={<ProviderHome />} />
              <Route path="/provider/profile" element={<ProviderSetup />} />
              <Route path="/provider/requests" element={<BrowseRequests />} />
              <Route path="/provider/jobs" element={<MyJobs />} />
            </Route>

            <Route path="/history" element={<History />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}