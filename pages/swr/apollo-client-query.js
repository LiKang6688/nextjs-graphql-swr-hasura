import { gql } from "@apollo/client";
import useSWR from "swr";
import client from "../../libs/apollo-client";

const variables = {
  limit: 10,
};
const usersQuery = {
  query: gql`
    query users($limit: Int!) {
      users(limit: $limit, order_by: { created_at: desc }) {
        id
        name
      }
    }
  `,
  variables,
};

const fetcher = async () => {
  const { data } = await client.query(usersQuery);
  return data;
};

export default function ApolloClientQuery(props) {
  // The useSWR hook gets a graphql query as the key and the fetcher function
  const { data, error } = useSWR(usersQuery, fetcher, {
    initialData: props,
    refreshInterval: 1000,
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
  const { data } = await client.query(usersQuery);

  return {
    props: {
      users: data.users,
    },
  };
}
