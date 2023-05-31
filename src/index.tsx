import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AppProvider } from './AppContext'
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { GoogleOAuthProvider } from '@react-oauth/google';

/*
JWT token custom claims are accessible through Auth0 console -> Actions -> Flows -> Login -> hasura-claims
*/
const AuthApolloProvider: React.FC = ({ children }) => {
  const { getAccessTokenSilently, user } = useAuth0()

  // useEffect(()=>{
  //   console.log('user', user)
  // }, [user])

  const httpLink: ApolloLink = createHttpLink({
    // uri: "http://localhost:8080/v1/graphql"
    uri: `https://rpgsheetcreator.hasura.app/v1/graphql`
  })

  const authLink = setContext(async () => {
    const token = await getAccessTokenSilently().catch((err) => console.log(err))
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Hasura-User-Id": user!.name
      }
    }
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    // uri:"http://localhost:8080/v1/graphql",
    uri: "https://rpgsheetcreator.hasura.app/v1/graphql",
    cache: new InMemoryCache(),
    connectToDevTools: true
  })

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}

const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
      redirectUri={`http://localhost:3000/`}//change this to live url before deploy
      // redirectUri={`https://rpgsheetgenerator.web.app/`}
      audience={"rpgsheetcreator"}
      useRefreshTokens={true}
    >
      <AuthApolloProvider>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENTID as string}>
          <AppProvider >
            <App />
          </AppProvider >
        </GoogleOAuthProvider>
      </AuthApolloProvider>
    </Auth0Provider>
  </React.StrictMode>
)

reportWebVitals();