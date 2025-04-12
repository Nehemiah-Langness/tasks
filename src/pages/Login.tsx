import { LoginButton } from "../components/LoginButton";
import Logo from "../assets/logo.svg?react";

export function Login() {
  return (
    <div
      className="d-flex h-100 justify-content-center align-items-center gap-3 flex-column"
      style={{ background: 'url("/bg.png")' }}
    >
      <div className="d-flex justify-content-center align-items-center gap-3">
        <Logo height={"100%"} />

        <span className="display-5">Tasks List</span>
      </div>
      <LoginButton />
    </div>
  );
}
