const GRAPHQL_ENDPOINT = "https://" + process.env.NEXT_PUBLIC_HASURA_URL;
const HASURA_ADMIN_SECRET = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
const headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
};

const _fetch = async (...args) => {
  const options = {
    headers: headers,
    method: "POST",
    body: JSON.stringify(args[0]),
  };
  const res = await fetch(GRAPHQL_ENDPOINT, options);
  const res_json = await res.json();
  if (res_json.errors) {
    throw JSON.stringify(res_json.errors);
  }
  return res_json.data;
};

export default _fetch;
