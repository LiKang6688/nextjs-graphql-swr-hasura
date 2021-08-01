import { ApolloClient, InMemoryCache } from "@apollo/client";

const HASURA_ADMIN_SECRET = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
const client = new ApolloClient({
  // specifies the URL of our GraphQL server
  uri: "https://" + process.env.NEXT_PUBLIC_HASURA_URL,
  headers: {
    "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
  },
  // Apollo Client uses to cache query results after fetching them.
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

export default client;
