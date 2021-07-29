import React, { useState } from "react";
import useSWR, { mutate, trigger } from "swr";
// https://swr.vercel.app
import { v4 as uuidv4 } from "uuid";
import { gql } from "graphql-request";
import graphQLClient from "../libs/graphQLClient";

const variables = {
  limit: 10,
};
const usersQuery = gql`
  query users($limit: Int!) {
    users(limit: $limit, order_by: { created_at: desc }) {
      id
      name
    }
  }
`;

const fetcher = async (query) => await graphQLClient.request(query, variables);

export default function OptimisticUI(props) {
  const [text, setText] = useState("");
  const { data, error } = useSWR(usersQuery, fetcher, { initialData: props });

  if (error) return <div>Error...</div>;
  if (!data) return <div>Loading...</div>;

  async function handleSubmit(event) {
    event.preventDefault();
    const id = uuidv4();
    // mutate current data to optimistically update the UI
    // in the mutate method,a key can be passed (GraphQL query will be the key for us)
    // and the new data to be used along with a boolean to specify whether you want to revalidate or not.
    // update the local data immediately, but disable the revalidation
    mutate(usersQuery, { users: [...data.users, { id, name: text }] }, false);
    // send text to the API
    const usersMutation = gql`
      mutation users($id: String!, $name: String!) {
        insert_users(objects: [{ id: $id, name: $name }]) {
          affected_rows
        }
      }
    `;
    const variables = {
      id: id,
      name: text,
    };
    try {
      // send a request to the API to update the source
      await graphQLClient.request(usersMutation, variables);
    } catch (error) {
      console.error(JSON.stringify(error, undefined, 2));
    }
    // tell all SWRs with this key to revalidate
    trigger(usersMutation);
    setText("");
  }

  //   Todo: File Upload
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
  const fetch = await graphQLClient.request(usersQuery, variables);
  const users = fetch.users;

  return {
    props: {
      users,
    },
  };
}
