import { gql } from "@apollo/client";
import useSWR from "swr";
import client from "../libs/apollo-client";

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

export default function Main(props) {
  // The useSWR hook gets a graphql query as the key and the fetcher function
  const { data, error } = useSWR(usersQuery, fetcher, { initialData: props });

  if (error) return <div>Error...</div>;
  if (!data) return <div>Loading...</div>;

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
