import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("questboard_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("questboard_user");
    setUser(null);
  };

  const handleUserUpdated = (updatedUser) => {
    localStorage.setItem("questboard_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (loading) return null;

  return user ? (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      onUserUpdated={handleUserUpdated}
    />
  ) : (
    <Auth onLoginSuccess={(userData) => setUser(userData)} />
  );
}

export default App;