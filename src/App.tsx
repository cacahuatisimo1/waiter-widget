
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useStore } from "@/store";
import Login from "@/pages/Login";
import WaiterDashboard from "@/pages/WaiterDashboard";
import ChefDashboard from "@/pages/ChefDashboard";

const ProtectedRoute = ({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: "waiter" | "chef";
}) => {
  const user = useStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/waiter"
          element={
            <ProtectedRoute allowedRole="waiter">
              <WaiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chef"
          element={
            <ProtectedRoute allowedRole="chef">
              <ChefDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
