import subscribe from "../../libs/subscribe";
import useSWR from "swr";

const USER_SUBSCRIPTION = `
  subscription {
    users(order_by: {created_at: desc}, limit: 10) {
      id
      name
      created_at
    }
  }
`;

const subscriber = async (...args) => subscribe(USER_SUBSCRIPTION);

export default function Subscription(props) {
  const { data, error } = useSWR("subscription", subscriber);

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
