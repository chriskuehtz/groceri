/* Import faunaDB sdk */
const faunadb = require("faunadb");
const q = faunadb.query;

exports.handler = (event, context) => {
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    //secret: process.env.FAUNADB_SERVER_SECRET,
    secret: "fnAEBi9JboACAVwY2zN8kZ50lsbqMIbm_qgvNKK0",
  });
  const data = JSON.parse(event.body);
  console.log(data)

  return client
    .query(q.Get(q.Match(q.Index("u"), data.user)))
    .then((response) => {
      console.log("user valid");
      console.log(response);
      return {
        message: "valid",
        statusCode: 200,
        body: JSON.stringify({
          hash: response.data.hash,
        }),
      };
    })
    .catch((error) => {
      console.log("error", error);
      return {
        message: "failure",
        statusCode: 400,
        body: JSON.stringify(error),
      };
    });
};
