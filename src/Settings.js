import React, { useState } from "react";
import {
  Button,
  IconButton,
  TextField,
  Card,
  Grid,
  Dialog,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import bcryptjs from "bcryptjs";
import api from "./utils/api";
import "./App.css";

const Settings = (props) => {
  const [feedback, setFeedback] = useState("");
  const [newpw, setNewpw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [warning, setWarning] = useState("");
  const [color, setColor] = useState("");

  const handleInput = (event) => {
    if (event.target.name === "feedback") {
      setFeedback(event.target.value);
    } else if (event.target.name === "newpw") {
      setNewpw(event.target.value);
      if (event.target.value !== confirm) {
        setWarning("passwords are not the same");
        setColor("red");
      } else setWarning("");
    } else if (event.target.name === "confirm") {
      setConfirm(event.target.value);
      if (newpw !== event.target.value) {
        setWarning("passwords are not the same");
        setColor("red");
      } else setWarning("");
    }
  };
  const giveFeedback = (u) => {
    setFeedback("");

    props.giveFeedback(u);
    return alert("THANK YOU VERY MUCH FOR YOUR FEEDBACK");
  };
  const changePW = () => {
    if (newpw !== confirm) {
      setWarning("passwords are not the same");
      setColor("red");
    } else {
      let salt = bcryptjs.genSaltSync(10);
      let hash = bcryptjs.hashSync(newpw, salt);
      api.changePW({ user: props.user, hash: hash });
      setWarning("password changed");
      setColor("green");
    }
  };
  return (
    <Dialog
      fullScreen
      open={props.settings}
      onClose={() => props.setSettingsdialog(false)}
    >
      <div className="Settings">
        <IconButton
          style={{
            backgroundColor: "white",
            position: "absolute",
            right: "3vw",
            top: "3vw",
          }}
          onClick={() => props.setSettingsdialog(false)}
        >
          <CloseIcon />
        </IconButton>
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
              elevation={3}
              style={{
                margin: 10,
                backgroundColor: "#FAFAFA",
                paddingBottom: 20,
              }}
            >
              <h1 style={{ paddingLeft: 20 }}>Data:</h1>

              <h3 style={{ paddingLeft: 20 }}>Change Password:</h3>

              <TextField
                variant="outlined"
                style={{ width: "60%", padding: "2%" }}
                type="password"
                name="newpw"
                placeholder="new Password"
                value={newpw}
                onChange={(event) => handleInput(event)}
              />
              <TextField
                variant="outlined"
                style={{ width: "60%", padding: "2%" }}
                type="password"
                name="confirm"
                placeholder="confirm Password"
                value={confirm}
                onChange={(event) => handleInput(event)}
              />
              <p style={{ paddingLeft: 20, color: color }}>{warning}</p>
              <Button
                style={{ marginLeft: 20, height: 56 }}
                variant="outlined"
                onClick={() => changePW()}
              >
                Change Password
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card
              elevation={3}
              style={{
                margin: 10,
                backgroundColor: "#FAFAFA",
                paddingBottom: 20,
                marginBottom: 50,
              }}
            >
              <h1 style={{ paddingLeft: 20 }}>Feedback:</h1>
              <h3 style={{ paddingLeft: 20 }}>Tell me what can be improved</h3>

              <TextField
                multiline
                rows={4}
                variant="outlined"
                style={{ width: "96%", padding: "2%" }}
                type="textarea"
                name="feedback"
                placeholder="what's on your mind"
                value={feedback}
                onChange={(event) => handleInput(event)}
              />
              <Button
                style={{ marginLeft: 20, height: 56 }}
                variant="outlined"
                onClick={() =>
                  giveFeedback({ user: props.user, message: feedback })
                }
              >
                Give Feedback
              </Button>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
};
export default Settings;
