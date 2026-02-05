import { useState } from "react";
import { login, register } from "../endpoints/api";

const RegisterPage = () => {
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleRegister = async (data: FormData) => {
    if (
      (data.get("password") as string) ===
      (data.get("confirmPassword") as string)
    ) {
      await register(
        data.get("username") as string,
        data.get("email") as string,
        data.get("password") as string,
      );
      await login(
        data.get("username") as string,
        data.get("password") as string,
      );
    } else setPasswordsMatch(false);
  };

  return (
    <>
      <form autoComplete="off" action={handleRegister}>
        <label htmlFor="usernameInputField">Username: </label>
        <input type="text" name="username" id="usernameInputField" required />

        <label htmlFor="emailInputField">Email: </label>
        <input type="email" name="email" id="emailInputField" required />

        <label htmlFor="passwordInputField">Password: </label>
        <input
          type="password"
          name="password"
          id="passwordInputField"
          required
        />

        <label htmlFor="confirmPasswordInputField">Confirm Password: </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPasswordInputField"
          required
        />

        <button type="submit">Register</button>
      </form>
      {!passwordsMatch && <p>Passwords dont match</p>}
    </>
  );
};

export default RegisterPage;
