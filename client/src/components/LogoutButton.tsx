import { useAuth0 } from '@auth0/auth0-react';
import { Button } from './ButtonGroup';

const LogoutButton = () => {
  const { logout } = useAuth0();

  const logoutWithRedirect = () => {
    return logout({
      returnTo: window.location.origin,
    });
  }

  return (
    <Button
      className="w-40 px-2 py-0 border border-gray-300 text-sm tv:text-lg font-medium text-gray-900 rounded-lg hover:bg-gray-300 bg-gray-100"
      onClick={() => logoutWithRedirect()}
    >Log out</Button>
  );
};

export default LogoutButton;
