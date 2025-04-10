import { useAuth0 } from "@auth0/auth0-react";

export function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className="btn btn-primary px-5 btn-sm"
      onClick={() => loginWithRedirect()}
    >
      Log in
    </button>
  );
}
