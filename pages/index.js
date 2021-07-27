import React from "react";
import useSWR from "swr";
import query from "../libs/query";

const gqlQuery = {
  query: "query { users(limit:10, order_by:{created_at: desc}) { id name } }",
};

const fetcher = async (...args) => await query(gqlQuery);

export default function Main(props) {
  // The useSWR hook gets a graphql query as the key and the fetcher function
  const { data, error } = useSWR(gqlQuery, fetcher, {
    initialData: props,
  });

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
  const fetch = await query(gqlQuery);
  const users = fetch.users;

  return {
    props: {
      users,
    },
  };
}
