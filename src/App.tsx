import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Tasks } from "./pages/Tasks";
import { ErrorMessage } from "./components/ErrorMessage";
import { LoggingInMessage } from "./components/LoggingInMessage";
import { Layout } from "./pages/Layout";
import { Login } from "./pages/Login";

function App() {
  const { isLoading, isAuthenticated, error } = useAuth0();

  if (isLoading) {
    return <LoggingInMessage />;
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
            <Route path="/tasks" element={<Tasks />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  } else {
    return <Login />;
  }
}

export default App;
