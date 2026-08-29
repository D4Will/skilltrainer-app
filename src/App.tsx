import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router";
import { useLayoutEffect } from "react";
import type { ReactNode } from "react";
import TargetsPage from "./pages/TargetsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import StatsPage from "./pages/StatsPage";
import Layout from "./Layout";
import AuthProvider from "./contexts/useAuth";
import PrivateRoute from "./components/PrivateRoute";
import SkillsPage from "./pages/SkillsPage";
import ReactionPage from "./pages/ReactionPage";
import TypingPage from "./pages/TypingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";

interface Props {
  children: ReactNode;
}

const Wrapper = ({ children }: Props) => {
  const location = useLocation();

  useLayoutEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return children;
};

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Wrapper>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<SkillsPage />} />
                <Route path="/targets" element={<TargetsPage />} />
                <Route path="/reaction" element={<ReactionPage />} />
                <Route path="/typing" element={<TypingPage />} />
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
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              </Route>
            </Routes>
          </Wrapper>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
