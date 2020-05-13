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

  return client
    .query(
      q.Update(q.Ref(`classes/list/265419174562497035`), {
        data: { list: f },
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
};
