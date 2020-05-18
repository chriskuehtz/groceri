import React, { useState } from "react";

import {
  Button,
  ButtonGroup,
  IconButton,
  TextField,
  Dialog,
  Card,
  Grid,
  Checkbox,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import "./App.css";

const Item = (props) => {
  const [dialog, setDialog] = useState(false);
  const [input, setInput] = useState(props.name);

  const filters = props.filters;

  const handleInput = (event) => {
    if (event.target.name === "input") {
      setInput(event.target.value);
    }
  };
  const changeEntry = () => {
    if (input !== props.name) {
      props.changeEntry(props.name, input);
      setDialog(false);
      setInput("");
    } else {
      setDialog(false);
    }
  };
  const pushFilter = (a, b) => {
    if (input !== props.name) {
      props.changeEntry(props.name, input);
    }
    props.pushFilter(a, b);
    setDialog(false);
    setInput("");
  };
  const handleWeekly = () => {
    if (props.weekly === true) {
      props.setWeeklyList(props.weeklyList.filter((e) => e !== props.name));
    } else {
      props.setWeeklyList(props.weeklyList.concat(props.name));
    }
  };
  const handleMonthly = () => {
    if (props.monthly === true) {
      props.setMonthlyList(props.monthlyList.filter((e) => e !== props.name));
    } else {
      props.setMonthlyList(props.monthlyList.concat(props.name));
    }
  };

  return (
    <ButtonGroup
      style={{
        width: "90%",
        marginLeft: "5%",
        marginBottom: 5,
      }}
      color="dark"
      aria-label="dark button group"
    >
      <Button style={{ width: "80%" }} onClick={() => setDialog(true)}>
        {props.name}
      </Button>

      <Dialog fullScreen open={dialog} onClose={() => setDialog(false)}>
        <div className="ItemMenu">
          <Grid
            style={{
              minHeight: "100vh",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
              marginBottom: 50,
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
                }}
              >
                <TextField
                  variant="outlined"
                  style={{ width: "70%", padding: 10, paddingRight: 0 }}
                  type="text"
                  name="input"
                  placeholder="Input"
                  value={input}
                  onChange={(event) => handleInput(event)}
                />
                <IconButton
                  style={{
                    backgroundColor: "white",
                    position: "absolute",
                    right: "3vw",
                    top: "3vw",
                  }}
                  onClick={() => changeEntry()}
                >
                  <CloseIcon />
                </IconButton>
                <p style={{ paddingLeft: 20 }}>
                  weekly staple
                  <Checkbox
                    color="default"
                    disabled={props.monthly}
                    checked={props.weekly}
                    onChange={() => handleWeekly()}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </p>
                <p style={{ paddingLeft: 20 }}>
                  monthly staple
                  <Checkbox
                    color="default"
                    disabled={props.weekly}
                    checked={props.monthly}
                    onChange={() => handleMonthly()}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </p>
              </Card>
            </Grid>

            {filters.map((f) => (
              <Grid item xs={6} md={3}>
                <Card
                  elevation={3}
                  style={{
                    backgroundColor: "white",
                    width: "94%",
                    margin: "3%",
                    minHeight: 95,
                  }}
                  onClick={() => pushFilter(f[0], input)}
                >
                  <h2 style={{ paddingLeft: 10 }}>{f[0]}</h2>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </Dialog>
      <Button
        aria-label="delete"
        onClick={() =>
          props.deleteEntry(props.list.filter((l) => l !== props.name))
        }
      >
        <DeleteIcon />
      </Button>
    </ButtonGroup>
  );
};
export default Item;
