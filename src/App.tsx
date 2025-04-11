import { useAuth0 } from "@auth0/auth0-react";
import { faBug, faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar } from "./components/Navbar";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Footer } from "./components/Footer";
import { LoginButton } from "./components/LoginButton";
import { useCallback, useEffect, useState } from "react";

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

const storageApiUrl =
  window.location.hostname === "localhost" ? "http://localhost:3001/data" : "tasks-storage-drbmdvdpgmf5cbed.centralus-01.azurewebsites.net";

function Home() {
  const { getAccessTokenSilently, getAccessTokenWithPopup, user } = useAuth0();

  const [data, setData] = useState<object>();

  const getToken = useCallback(async () => {
    const params = {
      authorizationParams: {
        audience: "https://dev-s2un5a06nihn1i1l.us.auth0.com/api/v2/",
      },
    };

    return await getAccessTokenSilently(params)
      .catch(() => {
        return getAccessTokenWithPopup(params);
      })
      .catch((er) => {
        console.error(er);
        return null;
      });
  }, [getAccessTokenSilently, getAccessTokenWithPopup]);

  useEffect(() => {
    const getData = async () => {
      const token = await getToken();

      if (!token) return;

      fetch(storageApiUrl, {
        headers: {
          Authorization: token,
        },
      }).then(async (result) => {
        setData(await result.json());
      });
    };

    getData();
  }, [getToken]);

  return (
    <div>
      Your Data: <br />
      <pre>{JSON.stringify(data, undefined, " ")}</pre>
      <button
        className="btn btn-primary"
        onClick={async () => {
          const token = await getToken();
          if (!token) {
            return;
          }

          fetch(storageApiUrl, {
            body: JSON.stringify({
              date: Date.now(),
              user: user?.email,
            }),
            method: "POST",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }).then(async (result) => {
            console.log(await result.json());
          });
        }}
      >
        Create Save File
      </button>
    </div>
  );
}

export default App;
