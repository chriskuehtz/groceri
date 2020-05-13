import React, { useState } from "react";

import {
  Button,
  ButtonGroup,
  IconButton,
  TextField,
  Dialog,
  Card,
  Grid,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import "./Item.css";

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
    if (input !== "") {
      props.changeEntry(props.name, input);
      setDialog(false);
    }
  };
  const pushFilter = (a, b) => {
    if (input !== props.name) {
      props.changeEntry(props.name, input);
    }
    props.pushFilter(a, b);
    setDialog(false);
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
        <Grid
          className="ItemMenu"
          style={{
            minHeight: window.innerHeight + 20,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
          container
          spacing={2}
        >
          <Grid item xs={10}>
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
            </Card>
          </Grid>
          <Grid item xs={2}>
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
          </Grid>

          {filters.map((f) => (
            <Grid item xs={6} md={3}>
              <Card
                elevation={3}
                style={{
                  backgroundColor: "white",
                  width: "90%",
                  marginLeft: "5%",
                  minHeight: 95,
                }}
                onClick={() => pushFilter(f[0], input)}
              >
                <h2 style={{ paddingLeft: 10 }}>{f[0]}</h2>
              </Card>
            </Grid>
          ))}
        </Grid>
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
