import { useAuth0 } from "@auth0/auth0-react";
import { faBug, faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar } from "./components/Navbar";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Footer } from "./components/Footer";
import { LoginButton } from "./components/LoginButton";

function App() {
  const { isLoading, isAuthenticated, error } = useAuth0();

  if (isLoading) {
    return (
      <div className="d-flex h-100 justify-content-center align-items-center">
        <div className="d-flex justify-content-center align-items-center gap-3">
          <FontAwesomeIcon className="display-1" spin icon={faSpinner} />
          <span className="display-5">Loading</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex h-100 justify-content-center align-items-center gap-3 flex-column">
        <div className="d-flex justify-content-center align-items-center gap-3">
          <FontAwesomeIcon className="display-1 text-danger" icon={faBug} />
          <span className="display-5">An error occurred</span>
        </div>
        <div>{error?.message ?? "Error Message"}</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  } else {
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
}

function Layout() {
  return (
    <div className="h-100 d-flex flex-column">
      <Navbar />
      <div className="flex-grow-1 pt-5">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function Home() {
  return <div>HOME</div>;
}

export default App;
