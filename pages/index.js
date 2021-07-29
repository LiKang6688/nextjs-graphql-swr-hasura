import React from "react";
import useSWR from "swr";
import query from "../libs/query";

const usersQuery = `query users($limit: Int!) {
  users(limit: $limit, order_by: {created_at: desc}) 
  { 
    id 
    name 
  }
}`;

const fetcher = async () => await query(usersQuery);

export default function Main(props) {
  // The useSWR hook gets a graphql query as the key and the fetcher function
  const { data, error } = useSWR(usersQuery, fetcher, {
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
  const fetch = await query(usersQuery);
  const users = fetch.users;

  return {
    props: {
      users,
    },
  };
}
