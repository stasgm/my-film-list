import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const useToken = ({ audience, scope }: { audience: string, scope: string }): string => {
  const { getAccessTokenSilently } = useAuth0();

  const [state, setToken] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const accessToken = await getAccessTokenSilently({ audience, scope });
        setToken(accessToken);
      } catch {
        setToken('');
      }
    })();
  }, [audience, getAccessTokenSilently, scope]);

  return state;
};

export { useToken };
