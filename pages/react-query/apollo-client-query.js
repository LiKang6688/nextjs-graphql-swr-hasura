import { gql } from "@apollo/client";
import { useQuery } from "react-query";
import { dehydrate } from "react-query/hydration";
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

const fetcher = async () => await client.query(usersQuery);

export default function ApolloClientQuery(props) {
  // A unique key you provide is used internally for refetching, caching, and sharing your queries throughout your application
  // A function that returns a promise
  const { isLoading, error, data } = useQuery("users", fetcher, {
    initialData: props,
  });

  if (error) return <div>Error...</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Users from database</h1>
      <div>
        {data.data.users.map((user) => (
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
      data: data,
    },
  };
}
