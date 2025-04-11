import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

export function useToken() {
  const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
  return useCallback(async () => {
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
}
