import React from "react";
import useSWR from "swr";
import fetch from "../../libs/fetch";

const usersQuery = {
  query: `query users($limit: Int!) {
    users(limit: $limit, order_by: {created_at: desc}) 
    { 
      id
      name
    }
  }`,
  variables: { limit: 10 },
};

const fetcher = async () => await fetch(usersQuery);

export default function FetchQuery(props) {
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

// during the build process，
// get any data needed to be passed into the page component as props
export async function getStaticProps() {
  const query = await fetch(usersQuery);
  const users = query.users;

  return {
    props: {
      users,
    },
  };
}
