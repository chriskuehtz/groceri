import React, { useState } from "react";
import Item from "./Item";
import { Card, ButtonGroup, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const Category = (props) => {
  return (
    <Card
      elevation={3}
      style={{
        backgroundColor: "white",
        width: "90%",
        marginLeft: "5%",
        minHeight: 95,
      }}
    >
      <h2 style={{ paddingLeft: 10 }}>{props.name}</h2>
      {props.items.map((item) => (
        <Item
          name={item}
          list={props.list}
          deleteEntry={(l) => props.deleteEntry(l)}
          filters={props.filters}
          pushFilter={(cat, fil) => props.pushFilter(cat, fil)}
          changeEntry={(p, n) => props.changeEntry(p, n)}
        />
      ))}
    </Card>
  );
};
export default Category;
