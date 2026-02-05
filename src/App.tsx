import { BrowserRouter as Router, Routes, Route } from "react-router";
import TargetsPage from "./pages/TargetsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import StatsPage from "./pages/StatsPage";
import Layout from "./Layout";
import AuthProvider from "./contexts/useAuth";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<TargetsPage />} />
              <Route
                path="/stats"
                element={
                  <PrivateRoute>
                    <StatsPage />
                  </PrivateRoute>
                }
              />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
