import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { AppProvider } from './AppContext'
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

/*
JWT token custom claims are accessible through Auth0 console -> Actions -> Flows -> Login -> hasura-claims
*/
const AuthApolloProvider: React.FC = ({ children }) => {
  const { getAccessTokenSilently, user } = useAuth0()

  // useEffect(()=>{
  //   console.log('user', user)
  // }, [user])

  const httpLink : ApolloLink = createHttpLink({
    // uri: "http://localhost:8080/v1/graphql"
    uri: `https://rpgsheetcreator.hasura.app/v1/graphql`
  })

  const authLink  = setContext(async () => {
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
    uri:"https://rpgsheetcreator.hasura.app/v1/graphql",
    cache: new InMemoryCache(),
    connectToDevTools: true
  })

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={"dev-pbm6545e.us.auth0.com"}
      clientId={`qzU5ssLKwmV6MhOmVTlqYtwPnFUIln29`}
      redirectUri={`http://localhost:3000/`}//change this to live url before deploy
      audience={"rpgsheetcreator"}
      useRefreshTokens={true}
    >
      <AuthApolloProvider>
        <AppProvider >
          <App />
        </AppProvider >
      </AuthApolloProvider>
    </Auth0Provider>
  </React.StrictMode>
  , document.getElementById('root')
);

reportWebVitals();