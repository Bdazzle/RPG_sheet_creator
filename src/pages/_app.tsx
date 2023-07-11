import React from 'react';
import RootLayout from './layout';
// import { AppProvider } from '../AppContext'
// import reportWebVitals from '../reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AppProvider } from '../AppContext';
import "../styles/App.css"

/*
files that need to be changed for local testing:
This - localhosts to rpgsheetcreator uris (for Auth0Provider redirect)
firebase/config to test functions with firebase emulator
*/

/*THINGS TO ADD
*) change hasura jwt key to google after next build (if it ever works)
2) Move canvas stuff to editor screen? currently nothing there?!?!
3) mobile
4) make a key box for explainations of screens you aren't on, to the right of text, to make things look nicer,
5) add additional input to upload a character image?

Custom Sheets
1) json stored on hasura
2) images stored on firebase
*/

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

function App({ Component, pageProps }: any) {

    return (
        <React.StrictMode>
            {/* <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
      clientId={"qzU5ssLKwmV6MhOmVTlqYtwPnFUIln29"}
      // redirectUri={`http://localhost:3000/`}//change this to live url before deploy
      redirectUri={`https://rpgsheetgenerator.web.app/`}
      audience={"rpgsheetcreator"}
      useRefreshTokens={true}
    > */}
            <AuthApolloProvider>
                <AppProvider >
                    <RootLayout>
                        <Component {...pageProps} />
                    </RootLayout>
                </AppProvider >
            </AuthApolloProvider>
            {/* </Auth0Provider> */}
        </React.StrictMode>
    )
}

export default App

// reportWebVitals();