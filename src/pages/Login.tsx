import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginButton } from "../components/LoginButton";


export function Login() {
  return (
    <div className="d-flex h-100 justify-content-center align-items-center gap-3 flex-column">
      <div className="d-flex justify-content-center align-items-center gap-3">
        <FontAwesomeIcon className="display-1 text-primary" icon={faUser} />
        <span className="display-5">Please Login</span>
      </div>
      <LoginButton />
    </div>
  );
}
