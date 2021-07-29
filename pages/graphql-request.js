import React from "react";
import useSWR from "swr";
import { GraphQLClient, gql } from "graphql-request";

const GRAPHQL_ENDPOINT = "https://" + process.env.NEXT_PUBLIC_HASURA_URL;
const HASURA_ADMIN_SECRET = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
};
const variables = {
  limit: 5,
};
const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers,
});
const usersQuery = gql`
  query users($limit: Int!) {
    users(limit: $limit, order_by: { created_at: desc }) {
      id
      name
    }
  }
`;

const fetcher = async (query) => await graphQLClient.request(query, variables);

export default function Main(props) {
  // The useSWR hook gets a graphql query as the key and the fetcher function
  const { data, error } = useSWR(usersQuery, fetcher, { initialData: props });

  if (error) return <div>Error...</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Users from database</h1>
      <div>
        {data.users.map((user) => (
          <div key={user.id}>
            <p>{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const fetch = await graphQLClient.request(usersQuery, variables);
  const users = fetch.users;

  return {
    props: {
      users,
    },
  };
}
