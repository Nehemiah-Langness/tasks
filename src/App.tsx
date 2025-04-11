import { useAuth0 } from "@auth0/auth0-react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar } from "./components/Navbar";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Footer } from "./components/Footer";
import { LoginButton } from "./components/LoginButton";
import { Home } from "./pages/Home";
import { ErrorMessage } from "./components/ErrorMessage";
import { LoadingMessage } from "./components/LoadingMessage";

function App() {
  const { isLoading, isAuthenticated, error } = useAuth0();

  if (isLoading) {
    return <LoadingMessage />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
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

export default App;
