import { useState } from "react";
import { register } from "../endpoints/api";
import { useAuth } from "../contexts/useAuth";

const RegisterPage = () => {
  const auth = useAuth();

  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const [accountValid, setAccountValid] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleRegister = async (data: FormData) => {
    if (
      (data.get("password") as string) ===
      (data.get("confirmPassword") as string)
    ) {
      const res = await register(
        data.get("username") as string,
        data.get("email") as string,
        data.get("password") as string,
      );
      if (res.status === 400) {
        setAccountValid(false);
        setUsername(data.get("username") as string);
        setPassword(data.get("password") as string);
        setEmail(data.get("email") as string);
      } else {
        auth.loginUser(
          data.get("username") as string,
          data.get("password") as string,
        );
      }
    } else {
      setPasswordsMatch(false);
      setUsername(data.get("username") as string);
      setPassword(data.get("password") as string);
      setEmail(data.get("email") as string);
    }
  };

  return (
    <div className="register-main-wrapper">
      <form
        className="register-form-wrapper"
        autoComplete="off"
        action={handleRegister}
      >
        <h1 className="register-title">Register</h1>

        <div className="register-field-wrapper">
          <label htmlFor="usernameInputField">Username: </label>
          <input
            type="text"
            name="username"
            id="usernameInputField"
            defaultValue={username}
            required
          />
        </div>

        <div className="register-field-wrapper">
          <label htmlFor="emailInputField">Email: </label>
          <input
            type="email"
            name="email"
            id="emailInputField"
            defaultValue={email}
            required
          />
        </div>

        <div className="register-field-wrapper">
          <label htmlFor="passwordInputField">Password: </label>
          <input
            type="password"
            name="password"
            minLength={8}
            id="passwordInputField"
            defaultValue={password}
            required
          />
        </div>

        <div className="register-field-wrapper">
          <label htmlFor="confirmPasswordInputField">Confirm Password: </label>
          <input
            type="password"
            name="confirmPassword"
            minLength={8}
            id="confirmPasswordInputField"
            required
          />
        </div>

        {!passwordsMatch && (
          <div className="register-fail">Passwords dont match</div>
        )}
        {!accountValid && (
          <div className="register-fail">Username or email taken</div>
        )}

        <button className="register-button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
