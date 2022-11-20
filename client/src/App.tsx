import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Profile from "./pages/Profile";
import Loader from "./components/Loader";
import Layout from "./components/Layout";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isLoading, error, user } = useAuth0();
  const location = useLocation();

  if (error) {
    return <Loader error={error} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/profile" element={
        <RequireAuth>
          <Profile />
        </RequireAuth>
      }
      />
    </Routes>
  );
};

export default App;
