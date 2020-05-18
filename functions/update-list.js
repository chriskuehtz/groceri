const faunadb = require("faunadb");

const q = faunadb.query;

exports.handler = (event, context) => {
  /* configure faunaDB Client with our secret */
  console.log("went to /functions");
  console.log(event);

  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  });
  const f = JSON.parse(event.body);
  let ref = 0;

  return client
    .query(q.Get(q.Match(q.Index("entries"), "chris")))
    .then((response) => {
      ref = response.ref.id;
      client
        .query(
          q.Update(q.Ref(q.Collection("entries"), ref), {
            data: { list: f },
          })
        )
        .then((response) => {
          console.log("update list success", response);
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
