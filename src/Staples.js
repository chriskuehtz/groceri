import React, { useState } from "react";
import {
  ButtonGroup,
  Button,
  IconButton,
  TextField,
  Card,
  Grid,
  Dialog,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import "./App.css";

const Staples = (props) => {
  const [weekly, setWeekly] = useState("");
  const [monthly, setMonthly] = useState("");

  const handleInput = (event) => {
    if (event.target.name === "weekly") {
      setWeekly(event.target.value);
    } else if (event.target.name === "monthly") {
      setMonthly(event.target.value);
    }
  };
  const keyPressed = (event) => {
    //call updatelist by pressing enter in the
    if (event.key === "Enter") {
      if (event.target.name === "weekly") {
        props.setWeeklyList([weekly].concat(props.weeklyList));
        setWeekly("");
      } else if (event.target.name === "monthly") {
        props.setMonthlyList([monthly].concat(props.monthlyList));
        setMonthly("");
      }
    }
  };
  return (
    <Dialog
      fullScreen
      open={props.staples}
      onClose={() => props.setStaples(false)}
    >
      <div className="Staples">
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
                marginBottom: 50,
              }}
            >
              <h1 style={{ paddingLeft: 20 }}>STAPLES</h1>
              <IconButton
                style={{
                  backgroundColor: "white",
                  position: "absolute",
                  right: "3vw",
                  top: "3vw",
                }}
                onClick={() => props.setStaples(false)}
              >
                <CloseIcon />
              </IconButton>

              <h4 style={{ paddingLeft: 20 }}>WEEKLY STAPLES:</h4>

              <TextField
                variant="outlined"
                style={{ width: "90%", padding: 10, paddingRight: 0 }}
                type="text"
                name="weekly"
                placeholder="add weekly staple"
                value={weekly}
                onChange={(event) => handleInput(event)}
                onKeyPress={keyPressed}
              />
              {props.weeklyList.map((w, i) => (
                <ButtonGroup
                  key={i}
                  style={{
                    width: "90%",
                    marginLeft: "5%",
                    marginBottom: 5,
                  }}
                  aria-label="dark button group"
                >
                  <Button style={{ width: "80%" }}>{w}</Button>
                  <Button
                    style={{ width: "20%" }}
                    aria-label="delete"
                    onClick={() =>
                      props.setWeeklyList(
                        props.weeklyList.filter((e) => e !== w)
                      )
                    }
                  >
                    <DeleteIcon />
                  </Button>
                </ButtonGroup>
              ))}
              <Button
                style={{ marginLeft: 0, margin: 10, height: 56 }}
                variant="outlined"
                disableElevation
                onClick={() => props.addStaples(props.weeklyList)}
              >
                add all to list
              </Button>

              <h4 style={{ paddingLeft: 20, width: "60%" }}>
                MONTHLY STAPLES:
              </h4>

              <TextField
                variant="outlined"
                style={{ width: "90%", padding: 10, paddingRight: 0 }}
                type="text"
                name="monthly"
                placeholder="add monthly staple"
                value={monthly}
                onChange={(event) => handleInput(event)}
                onKeyPress={keyPressed}
              />
              {props.monthlyList.map((m, i) => (
                <ButtonGroup
                  key={i}
                  style={{
                    width: "90%",
                    marginLeft: 10,
                    marginBottom: 5,
                  }}
                  aria-label="dark button group"
                >
                  <Button style={{ width: "80%" }}>{m}</Button>
                  <Button
                    style={{ width: "20%" }}
                    aria-label="delete"
                    onClick={() =>
                      props.setMonthlyList(
                        props.monthlyList.filter((e) => e !== m)
                      )
                    }
                  >
                    <DeleteIcon />
                  </Button>
                </ButtonGroup>
              ))}
              <Button
                style={{ marginLeft: 0, margin: 10, height: 56 }}
                variant="outlined"
                disableElevation
                onClick={() => props.addStaples(props.monthlyList)}
              >
                add all to list
              </Button>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
};
export default Staples;
