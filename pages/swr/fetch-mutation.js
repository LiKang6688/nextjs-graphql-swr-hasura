import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { v4 as uuidv4 } from "uuid";
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

export default function FetchMutation(props) {
  const [text, setText] = useState("");
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
    mutate(usersQuery, { users: [...data.users, { id, name: text }] }, false);
    // send text to the API
    const usersMutation = {
      query: `mutation users($id: String!, $name: String!) 
        { insert_users(objects: [{id: $id, name: $name}]) 
          { affected_rows } 
        }`,
      variables: { id: id, name: text },
    };
    await fetch(usersMutation);
    // trigger a revalidation (refetch) to make sure our local data is correct
    mutate(usersQuery);
    setText("");
  }

  return (
    <div style={{ textAlign: "center" }}>
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
  const query = await fetch(usersQuery);
  const users = query.users;

  return {
    props: {
      users,
    },
  };
}
