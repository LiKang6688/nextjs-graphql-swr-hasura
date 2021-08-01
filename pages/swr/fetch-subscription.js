import useSWR from "swr";
import subscribe from "../../libs/subscribe";
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
const USER_SUBSCRIPTION = `
  subscription {
    users(order_by: {created_at: desc}, limit: 10) {
      id
      name
      created_at
    }
  }
`;

const subscriber = () => subscribe(USER_SUBSCRIPTION);

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
  const query = await fetch(usersQuery);
  const users = query.users;

  return {
    props: {
      users,
    },
  };
}
