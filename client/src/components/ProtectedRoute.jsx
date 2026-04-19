import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    if (exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

function ProtectedRoute({ redirectTo }) {
  return isAuthenticated() ? <Outlet /> : <Navigate to={redirectTo} />;
}

export default ProtectedRoute;