import { PropsWithChildren } from "react";
import { Auth0Provider } from "@auth0/auth0-react";

export function Auth({ children }: PropsWithChildren<object>) {
  return (
    <Auth0Provider
      domain="dev-s2un5a06nihn1i1l.us.auth0.com"
      clientId="cYV3sPQljNqRVLoAZvMoaAzo2ypQ3oS4"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
}
