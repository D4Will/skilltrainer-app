import { useAuth } from "../contexts/useAuth";
import { useState } from "react";

const LoginPage = () => {
  const auth = useAuth();

  type status = "not attempted" | "failed" | "success";

  const [loginStatus, setLoginStatus] = useState<status>("not attempted");
  const [username, setUsername] = useState<string>("");

  const handleLogin = async (data: FormData) => {
    const result = await auth.loginUser(
      data.get("username") as string,
      data.get("password") as string,
    );
    if (!result) {
      setLoginStatus("failed");
      setUsername(data.get("username") as string);
    }
  };

  return (
    <div className="login-main-wrapper">
      <form
        className="login-form-wrapper"
        autoComplete="off"
        action={handleLogin}
      >
        <h1 className="login-title">Login</h1>

        <div className="login-field-wrapper">
          <label htmlFor="usernameInputField">Username: </label>
          <input
            type="text"
            name="username"
            id="usernameInputField"
            defaultValue={username}
            required
          />
        </div>

        <div className="login-field-wrapper">
          <label htmlFor="passwordInputField">Password: </label>
          <input
            type="password"
            name="password"
            id="passwordInputField"
            required
          />
        </div>

        {loginStatus === "failed" && (
          <div className="login-fail">Login failed</div>
        )}

        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
