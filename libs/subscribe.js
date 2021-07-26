import { mutate } from "swr";

let latestData = null;

// setup ws and broadcast to all SWRs
const GRAPHQL_ENDPOINT_WSS = "wss://" + process.env.NEXT_PUBLIC_HASURA_URL;
console.log({ GRAPHQL_ENDPOINT_WSS });
const HASURA_ADMIN_SECRET = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
console.log({ HASURA_ADMIN_SECRET });

const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
};

const subscribe = async (...args) => {
  if (typeof window !== "undefined") {
    const ws = new WebSocket(GRAPHQL_ENDPOINT_WSS, "graphql-ws");
    const init_msg = {
      type: "connection_init",
      payload: { headers: headers },
    };
    ws.onopen = function (event) {
      ws.send(JSON.stringify(init_msg));
      const msg = {
        id: "1",
        type: "start",
        payload: {
          variables: {},
          extensions: {},
          operationName: null,
          query: args[0],
        },
      };
      ws.send(JSON.stringify(msg));
    };
    ws.onmessage = function (data) {
      const finalData = JSON.parse(data.data);
      if (finalData.type === "data") {
        latestData = finalData.payload.data;
        mutate("subscription", latestData, false);
        return latestData;
      }
    };
  }
};

export default subscribe;
