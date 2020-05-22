import React, { useState } from "react";
import { Dialog, Button, TextField, Card, Grid } from "@material-ui/core";

const LoginScreen = (props) => {
  const [un, setUn] = useState("");
  const [pw, setPW] = useState("");

  return (
    <Dialog fullScreen open={props.user === ""}>
      <div className="Login">
        <Grid
          style={{
            minHeight: "102vh",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
          container
          spacing={2}
        >
          <Grid item xs={12}>
            <Card
              style={{
                margin: 10,
                backgroundColor: "#FAFAFA",
              }}
            >
              <h1 style={{ paddingLeft: 10 }}>GROCERI</h1>
              <h3 style={{ paddingLeft: 10 }}>
                The navigation app for your supermarket
              </h3>

              <TextField
                variant="outlined"
                style={{ padding: 10 }}
                type="text"
                placeholder="Username"
                value={un}
                onChange={(event) => setUn(event.target.value)}
              />
              <TextField
                variant="outlined"
                style={{ padding: 10 }}
                type="password"
                placeholder="Password"
                value={pw}
                onChange={(event) => setPW(event.target.value)}
              />
              <p style={{ marginLeft: 10, color: "red" }}>{props.warning}</p>
              <Button
                style={{ marginLeft: 0, margin: 10, height: 56 }}
                variant="outlined"
                disableElevation
                onClick={() => props.validate(un, pw)}
              >
                Log In
              </Button>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
};
export default LoginScreen;
