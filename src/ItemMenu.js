//input to change the name
//checks to set weekly,monthly staple
//Buttons for Category
import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  IconButton,
  TextField,
  Card,
  Grid,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "./App.css";

const ItemMenu = (props) => {
  const filters = props.filters;
  const [input, setInput] = useState(props.name);
  const handleInput = (event) => {
    if (event.target.name === "input" && event.target.value !== "") {
      setInput(event.target.value);
    }
  };
  const changeEntry = () => {
    props.changeEntry(props.name, input);
    props.setMenu(false);
  };
  const pushFilter = (a, b) => {
    props.pushFilter(a, b);
    props.setMenu(false);
  };
  return (
    <div
      className="App"
      style={{
        zIndex: 5,
        height: window.innerHeight,
        width: window.innerWidth,
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Grid container spacing={2}>
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
            <IconButton onClick={() => changeEntry()}>
              <CloseIcon />
            </IconButton>
          </Card>
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
    </div>
  );
};

export default ItemMenu;
