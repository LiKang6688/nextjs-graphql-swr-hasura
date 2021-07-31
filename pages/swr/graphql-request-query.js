import React from "react";
import useSWR from "swr";
import { gql } from "graphql-request";
import graphQLClient from "../../libs/graphql-client";

const variables = {
  limit: 10,
};
const usersQuery = gql`
  query users($limit: Int!) {
    users(limit: $limit, order_by: { created_at: desc }) {
      id
      name
    }
  }
`;

const fetcher = async (query) => await graphQLClient.request(query, variables);

export default function GraphqlRequestQuery(props) {
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
