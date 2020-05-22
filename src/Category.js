import React from "react";
import Item from "./Item";
import { Card } from "@material-ui/core";

const Category = (props) => {
  return (
    <Card
      elevation={3}
      style={{
        backgroundColor: "white",
        margin: 10,
        minHeight: 95,
      }}
    >
      <h2 style={{ paddingLeft: 10 }}>{props.name}</h2>
      {props.items.map((item, i) => {
        let w = false;
        let m = false;
        if (props.weeklyList.includes(item)) w = true;
        if (props.monthlyList.includes(item)) m = true;
        //console.log(item + ": weekly:" + w + ", monthly:" + m);
        return (
          <Item
            key={i}
            name={item}
            list={props.list}
            deleteEntry={(l) => props.deleteEntry(l)}
            filters={props.filters}
            pushFilter={(cat, fil) => props.pushFilter(cat, fil)}
            changeEntry={(p, n) => props.changeEntry(p, n)}
            weekly={w}
            monthly={m}
            weeklyList={props.weeklyList}
            monthlyList={props.monthlyList}
            setWeeklyList={(l) => props.setWeeklyList(l)}
            setMonthlyList={(l) => props.setMonthlyList(l)}
          />
        );
      })}
    </Card>
  );
};
export default Category;
