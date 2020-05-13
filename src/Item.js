import React, { useState } from "react";

import { Button, ButtonGroup, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ItemMenu from "./ItemMenu.js";

const Item = (props) => {
  const [menu, setMenu] = useState(false);

  return menu ? (
    <ItemMenu
      filters={props.filters}
      name={props.name}
      pushFilter={(cat, fil) => props.pushFilter(cat, fil)}
      setMenu={(f) => setMenu(f)}
      changeEntry={(p, n) => props.changeEntry(p, n)}
      pushFilter={(cat, fil) => props.pushFilter(cat, fil)}
    />
  ) : (
    <ButtonGroup
      style={{
        width: "90%",
        marginLeft: "5%",
        marginBottom: 5,
      }}
      color="dark"
      aria-label="dark button group"
    >
      <Button style={{ width: "80%" }} onClick={() => setMenu(true)}>
        {props.name}
      </Button>
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
