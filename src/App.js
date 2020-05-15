import React, { useState } from "react";

import api from "./utils/api";
import isLocalHost from "./utils/isLocalHost";
import "./App.css";
import Category from "./Category";
import { Button, TextField, Card, Grid } from "@material-ui/core";

const App = () => {
  const [input, setInput] = useState("");
  const [list, setList] = useState([]);
  const [weeklyList, setWeeklyList] = useState([]);
  const [monthlyList, setMonthlyList] = useState([]);
  const [filters, setFilters] = useState([]);

  //basically componentdidMount
  const load = () => {
    if (filters.length === 0 && list.length === 0) {
      console.log("lets load some data");

      api.read().then((l) => {
        if (l.message === "unauthorized") {
          if (isLocalHost()) {
            alert(
              "FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info"
            );
          } else {
            alert(
              "FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct"
            );
          }
          return false;
        }

        console.log("data:");
        console.log(l);
        if (l.data.hasOwnProperty("list")) {
          setList(l.data.list);
          setFilters(l.data.filters);
          setWeeklyList(l.data.weekly);
          setMonthlyList(l.data.monthly);
          checkStaples(
            l.data.weeklyTimer,
            l.data.monthlyTimer,
            l.data.weekly,
            l.data.monthly
          );
        } else {
          console.log("something went wrong");
          setList(["An error occured, try refreshing the page"]);
        }
      });
    }
  };

  const handleInput = (event) => {
    if (event.target.name === "input") {
      setInput(event.target.value);
    }
  };
  const changeEntry = (prev, next) => {
    console.log("prev:" + prev);
    console.log("next:" + next);
    let temp = [].concat(list);
    temp = temp.map((t) => {
      if (t === prev) return next;
      else return t;
    });
    console.log(temp.join());
    setList(temp);
    api.updateList(temp);
  };
  const deleteEntry = (l) => {
    setList(l);
    api.updateList(l);
  };
  const pushFilter = (cat, filter) => {
    let categ = cat.toString();
    console.log("category:" + categ);
    console.log("filter:" + filter);
    let filtersCopy = [].concat(filters);
    console.log(filtersCopy);
    filtersCopy = filtersCopy.map((f) => f.filter((fi) => fi !== filter));
    console.log(filtersCopy.filter((f) => f.includes(categ)));
    filtersCopy.filter((f) => f.includes(categ))[0].push(filter.toLowerCase());
    console.log(filtersCopy);
    setFilters(filtersCopy);
    api.updateFilters(filtersCopy);
  };

  const updateList = () => {
    if (input !== "") {
      let i = input.toLowerCase();
      api.updateList(list.concat(i));
      setList(list.concat(i));
    }
  };
  const handleWeeklyList = (l) => {
    api.updateWeeklyList(l);
    setWeeklyList(l);
  };
  const handleMonthlyList = (l) => {
    api.updateMonthlyList(l);
    setMonthlyList(l);
  };
  const checkStaples = (w, m, wl, ml) => {
    if (
      (new Date().getTime() - w) / (1000 * 3600 * 24) > 6 &&
      (new Date().getTime() - m) / (1000 * 3600 * 24) > 29
    ) {
      console.log("what a coincidence, weekly and monthly staples at once");
      api.updateStapleTimer({
        weekly: new Date().getTime(),
        monthly: new Date().getTime(),
      });
      addStaples(wl.concat(ml));
    } else if ((new Date().getTime() - w) / (1000 * 3600 * 24) > 6) {
      console.log("need to add weekly staples");
      api.updateStapleTimer({ weekly: new Date().getTime(), monthly: m });
      addStaples(wl);
    } else if ((new Date().getTime() - m) / (1000 * 3600 * 24) > 29) {
      console.log("need to add monthly staples");
      api.updateStapleTimer({ weekly: w, monthly: new Date().getTime() });

      addStaples(ml);
    } else {
      console.log("not the time to add any staples");
    }
  };
  const addStaples = (t) => {
    console.log("t:" + t.join());

    t = t.filter((e) => list.includes(e) === false);
    console.log(t.join());
    setList(list.concat(t));
  };
  //function for adding smth with enter
  const keyPressed = (event) => {
    if (event.key === "Enter" && input !== "" && list.length < 200) {
      //if enter is pressed and input is not empty, add input to the list
      updateList();
      //empty the input field, so the user can input the next thing
      setInput("");
    }
  };
  const sorted = () => {
    let copyList = [].concat(list);
    copyList = copyList.map((e) => e.toLowerCase());
    let displayList = [];
    filters.forEach((f) => {
      let temp = [f[0]];
      if (f[0] === "OTHER") {
        temp = temp.concat(copyList);
        displayList.push(temp);
      } else {
        temp = temp.concat(copyList.filter((e) => f.includes(e)));
        displayList.push(temp);
        copyList = copyList.filter((e) => !f.includes(e));
      }
    });
    displayList = displayList.reverse();
    return displayList.map((d) =>
      d.length === 1 ? (
        ""
      ) : (
        <Grid item xs={12} lg={3}>
          <Category
            name={d[0]}
            items={d.slice(1)}
            list={list}
            deleteEntry={(l) => deleteEntry(l)}
            filters={filters}
            pushFilter={(cat, fil) => pushFilter(cat, fil)}
            changeEntry={(prev, next) => changeEntry(prev, next)}
            weeklyList={weeklyList}
            monthlyList={monthlyList}
            setWeeklyList={(l) => handleWeeklyList(l)}
            setMonthlyList={(l) => handleMonthlyList(l)}
          />
        </Grid>
      )
    );
  };

  return (
    <div className="App">
      {load()}
      <Grid container spacing={2} style={{ marginBottom: 0 }}>
        <Grid item xs={12}>
          <Card
            elevation={3}
            style={{
              margin: 10,
              backgroundColor: "#FAFAFA",
            }}
          >
            <h1>GROCERI</h1>
            <TextField
              variant="outlined"
              style={{ width: "60%", padding: 10, paddingRight: 0 }}
              type="text"
              name="input"
              placeholder="Input"
              value={input}
              onChange={(event) => handleInput(event)}
              onKeyPress={keyPressed}
            />
            <Button
              style={{ marginLeft: 0, margin: 10, height: 56 }}
              size="lg"
              variant="outlined"
              color="dark"
              disableElevation
              onClick={() => updateList()}
            >
              Add
            </Button>
          </Card>
        </Grid>
        {sorted()}
      </Grid>
    </div>
  );
};

export default App;
