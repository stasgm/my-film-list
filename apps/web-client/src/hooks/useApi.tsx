import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

type useApiT<T> = ({ options, url }: { url: string, options: Record<string, any> }) => { error?: Error | null; loading: boolean; data?: T };

const useApi: useApiT<any> = ({ options = {}, url }) => {
  const { getAccessTokenSilently } = useAuth0();

  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const { audience, scope, ...fetchOptions } = options;
        const accessToken = await getAccessTokenSilently({ audience, scope });
        const res = await fetch(url, {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            // Add the Authorization header to the existing headers
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setState({
          ...state,
          data: await res.json(),
          error: null,
          loading: false,
        });
      } catch (error: any) {
        setState({
          ...state,
          error,
          loading: false,
        });
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
};

export default useApi;
