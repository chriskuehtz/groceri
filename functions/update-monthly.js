const faunadb = require("faunadb");

const q = faunadb.query;

exports.handler = (event, context) => {
  /* configure faunaDB Client with our secret */
  console.log("went to /functions");
  console.log(event);

  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  });
  const data = JSON.parse(event.body);
  let ref = 0;

  return client
    .query(q.Get(q.Match(q.Index("entries"), data.u)))
    .then((response) => {
      console.log("success");
      console.log(response);
      console.log("id:" + response.ref.id);
      ref = response.ref.id;
      client
        .query(
          q.Update(q.Ref(q.Collection("entries"), ref), {
            data: { monthly: data.monthly },
          })
        )
        .then((response) => {
          console.log("success", response);
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
