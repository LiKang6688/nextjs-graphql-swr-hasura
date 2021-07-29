import { GraphQLClient } from "graphql-request";
// https://github.com/prisma-labs/graphql-request

const GRAPHQL_ENDPOINT = "https://" + process.env.NEXT_PUBLIC_HASURA_URL;
const HASURA_ADMIN_SECRET = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
};
const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers,
});

export default graphQLClient;
