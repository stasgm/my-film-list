import { useEffect } from "react";
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
import { lsUtils } from './utils';


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
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      try {
        const audience = process.env.REACT_APP_AUDIENCE!;
        const scope = ""
        const accessToken = await getAccessTokenSilently({ audience, scope });
        lsUtils.setToken(accessToken);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [getAccessTokenSilently]);

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
