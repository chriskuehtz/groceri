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
      console.log("update filters success");
      console.log(response);
      console.log("id:" + response.ref.id);
      ref = response.ref.id;
      client
        .query(
          q.Update(q.Ref(q.Collection("entries"), ref), {
            data: { filters: f },
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
