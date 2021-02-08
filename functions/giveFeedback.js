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
  const input = JSON.parse(event.body);
  let ref = "265946883492413954";

  return client
    .query(q.Get(q.Ref(q.Collection("feedback"), ref)))
    .then((response) => {
      console.log(response.data);
      let item = response.data.feedback.concat(input);
      client
        .query(
          q.Update(q.Ref(q.Collection("feedback"), ref), {
            data: { feedback: item },
          })
        )
        .then((response) => {
          console.log("update feedback success", response);
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
