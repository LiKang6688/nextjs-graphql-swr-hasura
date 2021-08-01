import { gql, useSubscription } from "@apollo/client";
import useSWR from "swr";
import client from "../../libs/apollo-client";
import wsClient from "../../libs/graphql-ws";

const variables = {
  limit: 10,
};
const USER_SUBSCRIPTION = gql`
  subscription users($limit: Int!) {
    users(order_by: { created_at: desc }, limit: $limit) {
      id
      name
      created_at
    }
  }
`;
const usersQuery = {
  query: gql`
    query users($limit: Int!) {
      users(limit: $limit, order_by: { created_at: desc }) {
        id
        name
      }
    }
  `,
  variables: {
    limit: 10,
  },
};

const subscriber = () => {
  return new Promise((resolve) => {
    wsClient
      .subscribe({
        query: USER_SUBSCRIPTION,
        variables,
      })
      .subscribe({
        next({ data }) {
          resolve(data);
        },
        error(err) {
          console.error("err", err);
        },
      });
  });
};

export default function Subscription(props) {
  const { data, error } = useSWR("subscription", subscriber, {
    initialData: props,
  });

  if (error) return <div>Error...</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Subscribed to Latest 10 users from the database</h1>
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
