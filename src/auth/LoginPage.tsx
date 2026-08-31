import { useDispatch } from "react-redux";
import { login } from "./authSlice";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(login(email || "demo-user"));
    navigate("/vehicles");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <label>
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <button type="submit">Sign in</button>
    </form>
  );
}
