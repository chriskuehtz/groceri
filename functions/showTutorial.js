const faunadb = require("faunadb");

const q = faunadb.query;

exports.handler = (event, context) => {
  /* configure faunaDB Client with our secret */
  console.log("went to /functions");
  console.log(event);

  const client = new faunadb.Client({
    //secret: process.env.FAUNADB_SERVER_SECRET,
    secret: "fnAEBi9JboACAVwY2zN8kZ50lsbqMIbm_qgvNKK0",
  });
  const data = JSON.parse(event.body);
  let ref = 0;

  return client
    .query(q.Get(q.Match(q.Index("userrefs"), data.user)))
    .then((response) => {
      ref = response.ref.id;
      client
        .query(
          q.Update(q.Ref(q.Collection("users"), ref), {
            data: { tutorial: data.tutorial },
          })
        )
        .then((response) => {
          console.log("update Tutorial success", response);
          return {
            message: "success",
            statusCode: 200,
            body: JSON.stringify(response),
          };
        })
        .catch((error) => {
          console.log("error", error);
          return {
            message: "error",
            statusCode: 400,
            body: JSON.stringify(error),
          };
        });
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
