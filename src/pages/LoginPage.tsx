import { useAuth } from "../contexts/useAuth";

const LoginPage = () => {
  const auth = useAuth();

  const handleLogin = async (data: FormData) => {
    auth.loginUser(
      data.get("username") as string,
      data.get("password") as string,
    );
  };

  return (
    <>
      <form autoComplete="off" action={handleLogin}>
        <label htmlFor="usernameInputField">Username: </label>
        <input type="text" name="username" id="usernameInputField" required />

        <label htmlFor="passwordInputField">Password: </label>
        <input
          type="password"
          name="password"
          id="passwordInputField"
          required
        />

        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default LoginPage;
