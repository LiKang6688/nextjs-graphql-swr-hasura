import { WebSocketLink } from "@apollo/client/link/ws";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const GRAPHQL_ENDPOINT_WSS = "wss://" + process.env.NEXT_PUBLIC_HASURA_URL;
const HASURA_ADMIN_SECRET = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
const wsLink =
  typeof window === "undefined"
    ? null
    : new WebSocketLink({
        uri: GRAPHQL_ENDPOINT_WSS,
        options: {
          lazy: true,
          reconnect: true,
          connectionParams: {
            //     authToken: user.authToken,
            headers: {
              "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
            },
          },
        },
      });

const wsClient = new ApolloClient({
  link: wsLink,
  headers: {
    "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
  },
  cache: new InMemoryCache(),
});

export default wsClient;
