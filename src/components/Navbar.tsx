import { Link, useLocation } from "react-router";
import Branding from "../assets/logo.svg?react";
import { useEffect } from "react";
import { LogoutButton } from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

export function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth0();

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, [pathname]);

  return (
    <nav className="navbar bg-primary navbar-expand-lg" data-bs-theme="dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <Branding height="3rem" />
        </Link>
        {user && (
          <div className="d-flex align-items-center gap-2 text-white h5 mb-0">
            <img
              src={user.picture}
              className="rounded-2"
              style={{ width: "2rem", height: "2rem" }}
            />
            <span>{user.name}'s Tasks</span>
          </div>
        )}
        <LogoutButton />
      </div>
    </nav>
  );
}
