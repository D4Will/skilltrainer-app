import { createContext, useContext, useRef, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { login, loggedIn, logout } from "../endpoints/api";
import { useNavigate } from "react-router";

type Auth = {
  loaded: boolean;
  authenticated: boolean;
  username: string;
  loginUser: (username: string, password: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
};

const AuthContext = createContext<Auth>({
  loaded: false,
  authenticated: false,
  username: "user",
  loginUser: async () => false,
  logoutUser: async () => {},
});

interface Props {
  children: ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [name, setName] = useState("user");
  const nav = useNavigate();

  const timeOutId = useRef<number>(0);

  const loginUser = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    const success = await login(username, password);
    if (success) {
      setAuthenticated(true);
      setName(username);
      nav("/");
      return true;
    }
    return false;
  };

  const logoutUser = async (): Promise<void> => {
    const success = await logout();
    if (success) {
      setAuthenticated(false);
      setName("user");
      nav("/login");
    }
  };

  useEffect(() => {
    const setupAuthentication = async (): Promise<void> => {
      const loginResponse = await loggedIn();
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        setAuthenticated(true);
        setName(loginData.name);
      } else {
        setAuthenticated(false);
        setName("user");
      }
      clearTimeout(timeOutId.current);
      setLoaded(true);
    };

    timeOutId.current = setTimeout(() => {
      setLoaded(true);
    }, 5000);
    setupAuthentication();

    return () => {
      clearTimeout(timeOutId.current);
    };
  }, []);

  return (
    <AuthContext
      value={{
        loaded: loaded,
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
