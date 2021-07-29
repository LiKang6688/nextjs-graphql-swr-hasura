import React from "react";
import useSWR, { mutate, trigger } from "swr";
import query from "../libs/query";

import { v4 as uuidv4 } from "uuid";

const usersQuery = `query users($limit: Int!) { 
    users(limit: $limit, order_by: {created_at: desc}) 
    { 
      id 
      name 
    } 
  }`;

const fetcher = async () => await query(usersQuery);

export default function OptimisticUI(props) {
  const [text, setText] = React.useState("");
  const { data, error } = useSWR(usersQuery, fetcher, {
    initialData: props,
  });

  if (error) return <div>Error...</div>;
  if (!data) return <div>Loading...</div>;

  async function handleSubmit(event) {
    event.preventDefault();
    const id = uuidv4();
    // mutate current data to optimistically update the UI
    // in the mutate method,a key can be passed (GraphQL query will be the key for us)
    // and the new data to be used along with a boolean to specify whether you want to revalidate or not.
    mutate(query, { users: [...data.users, { id, name: text }] }, false);
    // send text to the API
    const mutation = {
      query:
        "mutation users($id: String!, $name: String!) { insert_users(objects: [{id: $id, name: $name}]) { affected_rows } }",
      variables: { id: id, name: text },
    };
    await fetch(mutation);
    // revalidate
    trigger(mutation);
    setText("");
  }

  return (
    <div>
      <h1>Insert a new user</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
        <button>Create</button>
      </form>
      <ul>
        {data
          ? data.users.map((user) => <li key={user.id}>{user.name}</li>)
          : "loading..."}
      </ul>
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
