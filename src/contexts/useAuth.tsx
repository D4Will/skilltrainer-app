import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { login, loggedIn, logout } from "../endpoints/api";
import { useNavigate } from "react-router";

type Auth = {
  authenticated: boolean;
  username: string;
  loginUser: Function;
  logoutUser: Function;
};

const AuthContext = createContext<Auth>({
  authenticated: false,
  username: "user",
  loginUser: () => {},
  logoutUser: () => {},
});

interface Props {
  children: ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [name, setName] = useState("user");
  const nav = useNavigate();

  const loginUser = async (username: string, password: string) => {
    const success = await login(username, password);
    if (success) {
      setAuthenticated(true);
      setName(username);
      nav("/");
    }
  };

  const logoutUser = async () => {
    const success = await logout();
    if (success) {
      setAuthenticated(false);
      setName("user");
      nav("/login");
    }
  };

  useEffect(() => {
    const setupAuthentication = async () => {
      const loginResponse = await loggedIn();
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        setAuthenticated(true);
        setName(loginData.name);
      } else {
        setAuthenticated(false);
        setName("user");
      }
    };

    setupAuthentication();
  }, []);

  return (
    <AuthContext
      value={{
        authenticated: authenticated,
        username: name,
        loginUser: loginUser,
        logoutUser: logoutUser,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
