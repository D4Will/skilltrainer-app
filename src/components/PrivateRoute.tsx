import { useAuth } from "../contexts/useAuth";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

interface Props {
  children: ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const auth = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (auth.loaded && !auth.authenticated) {
      nav("/login");
    }
  });

  return <>{auth.authenticated && auth.loaded && children}</>;
};

export default PrivateRoute;
