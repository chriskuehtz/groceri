import React, { useState, useEffect } from "react";
import bcryptjs from "bcryptjs";
import api from "./utils/api";
import isLocalHost from "./utils/isLocalHost";
import "./App.css";
import Category from "./Category";
import Staples from "./Staples";
import { Button, TextField, Card, Grid } from "@material-ui/core";
import LoginScreen from "./LoginScreen";
import Settings from "./Settings";

const App = () => {
  const [user, setUser] = useState("");
  const [input, setInput] = useState("");
  const [warning, setWarning] = useState("");
  const [list, setList] = useState([]);
  const [weeklyList, setWeeklyList] = useState([]);
  const [monthlyList, setMonthlyList] = useState([]);
  const [weeklyTimer, setWeeklyTimer] = useState("");
  const [monthlyTimer, setMonthlyTimer] = useState("");
  const [filters, setFilters] = useState([]);
  const [staplesdialog, setStaplesdialog] = useState(false);
  const [settingsdialog, setSettingsdialog] = useState(false);
  const [tutorial, setTutorial] = useState(false);
  const [ref, setRef] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (users.length > 1) {
        console.log("useEffect");
        load();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [users]);
  const setState = (l) => {
    //console.log(l);
    setList(l.data.list);
    setFilters(l.data.filters);
    setWeeklyList(l.data.weekly);
    setMonthlyList(l.data.monthly);
    sorted();
  };
  const validate = (u, p) => {
    api.validate(u).then((res) => {
      if (bcryptjs.compareSync(p, res.hash)) {
        setTutorial(res.tutorial);
        setWarning("");
        setUser(u);
      } else {
        setWarning("incorrect Password or Username");
      }
    });
  };
  const showTutorial = () => {
    setTutorial(false);
    api.showTutorial({ user: user, tutorial: false });
  };

  //basically componentdidMount
  const load = () => {
    if (user !== "") {
      api.read(user).then((l) => {
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

        setRef(Object.entries(l.ref)[0][1].id.toString());
        setList(l.data.list);
        setFilters(l.data.filters);
        setWeeklyList(l.data.weekly);
        setMonthlyList(l.data.monthly);
        setWeeklyTimer(l.data.weeklyTimer);
        setMonthlyTimer(l.data.monthlyTimer);
        setUsers(l.data.users);
        checkStaples(
          l.data.weeklyTimer,
          l.data.monthlyTimer,
          l.data.weekly,
          l.data.monthly
        );
      });
    } else {
      console.log("no user");
    }
  };
  const handleInput = (event) => {
    //handle the input field
    if (event.target.name === "input") {
      setInput(event.target.value);
    }
  };
  const changeEntry = (prev, next) => {
    //changes an entry in the list
    //console.log("prev:" + prev);
    //console.log("next:" + next);
    let temp = [].concat(list);
    temp = temp.map((t) => {
      if (t === prev) return next.toLowerCase();
      else return t;
    });
    //console.log(temp.join());
    api
      .update({
        ref: ref,
        data: {
          list: temp,
          filters: filters,
          weekly: weeklyList,
          monthly: monthlyList,
          weeklyTimer: weeklyTimer,
          monthlyTimer: monthlyTimer,
          users: users,
        },
      })
      .then((l) => {
        setState(l);
      });
  };
  const deleteEntry = (l) => {
    //deletes an entry and all duplicates

    api
      .update({
        ref: ref,
        data: {
          list: l,
          filters: filters,
          weekly: weeklyList,
          monthly: monthlyList,
          weeklyTimer: weeklyTimer,
          monthlyTimer: monthlyTimer,
          users: users,
        },
      })
      .then((l) => {
        setState(l);
      });
  };
  const pushFilter = (cat, filter) => {
    //adds a filter
    let categ = cat.toString();
    //console.log("category:" + categ);
    //console.log("filter:" + filter);
    let filtersCopy = [].concat(filters);
    //console.log(filtersCopy);
    filtersCopy = filtersCopy.map((f) => f.filter((fi) => fi !== filter));
    //console.log(filtersCopy.filter((f) => f.includes(categ)));
    filtersCopy.filter((f) => f.includes(categ))[0].push(filter.toLowerCase());
    //console.log(filtersCopy);

    api
      .update({
        ref: ref,
        data: {
          list: list,
          filters: filtersCopy,
          weekly: weeklyList,
          monthly: monthlyList,
          weeklyTimer: weeklyTimer,
          monthlyTimer: monthlyTimer,
          users: users,
        },
      })
      .then((l) => {
        setState(l);
      });
  };
  const updateList = () => {
    //add an item to the list
    if (list.includes(input)) {
      setWarning("this item is already on your list");
    } else if (input !== "" && input.length < 100) {
      let i = input.toLowerCase();
      let temp = list.concat(i);
      api
        .update({
          ref: ref,
          data: {
            list: temp,
            filters: filters,
            weekly: weeklyList,
            monthly: monthlyList,
            weeklyTimer: weeklyTimer,
            monthlyTimer: monthlyTimer,
            users: users,
          },
        })
        .then((l) => {
          setState(l);
        });
      setInput("");
      setWarning("");
    } else {
      setWarning("you cannot add a nameless entry");
    }
  };
  const keyPressed = (event) => {
    //call updatelist by pressing enter in the
    if (event.key === "Enter") {
      updateList();
    }
  };
  const handleWeeklyList = (l) => {
    //update the weekly staples list
    api
      .update({
        ref: ref,
        data: {
          list: list,
          filters: filters,
          weekly: l,
          monthly: monthlyList,
          weeklyTimer: weeklyTimer,
          monthlyTimer: monthlyTimer,
          users: users,
        },
      })
      .then((l) => {
        setState(l);
      });
  };
  const handleMonthlyList = (l) => {
    //update the monthly staples list
    api
      .update({
        ref: ref,
        data: {
          list: list,
          filters: filters,
          weekly: weeklyList,
          monthly: l,
          weeklyTimer: weeklyTimer,
          monthlyTimer: monthlyTimer,
          users: users,
        },
      })
      .then((l) => {
        setState(l);
      });
  };
  const checkStaples = (w, m, wl, ml) => {
    //compare the current date to the last time staples were added,  trigger addStaples if 7 or 30 days have passed
    if (
      (new Date().getTime() - w) / (1000 * 3600 * 24) > 6 &&
      (new Date().getTime() - m) / (1000 * 3600 * 24) > 29
    ) {
      //console.log("what a coincidence, weekly and monthly staples at once");
      api.updateStapleTimer({
        weekly: new Date().getTime(),
        monthly: new Date().getTime(),
        u: user,
      });
      addStaples(wl.concat(ml));
    } else if ((new Date().getTime() - w) / (1000 * 3600 * 24) > 6) {
      //console.log("need to add weekly staples");
      api.updateStapleTimer({
        weekly: new Date().getTime(),
        monthly: m,
        u: user,
      });
      addStaples(wl);
    } else if ((new Date().getTime() - m) / (1000 * 3600 * 24) > 29) {
      //console.log("need to add monthly staples");
      api.updateStapleTimer({
        weekly: w,
        monthly: new Date().getTime(),
        u: user,
      });

      addStaples(ml);
    } else {
      //console.log("not the time to add any staples");
    }
  };
  const addStaples = (t) => {
    //add the staples to the list, if they are not on it already
    //console.log("t:" + t.join());
    t = t.filter((e) => list.includes(e) === false);
    let temp = list.concat(t);
    api
      .update({
        ref: ref,
        data: {
          list: temp,
          filters: filters,
          weekly: weeklyList,
          monthly: monthlyList,
          weeklyTimer: weeklyTimer,
          monthlyTimer: monthlyTimer,
          users: users,
        },
      })
      .then((l) => {
        setState(l);
      });
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
    return displayList.map((d, i) =>
      d.length === 1 ? (
        ""
      ) : (
        <Grid key={i} item xs={12} lg={3}>
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
      {user !== "" ? (
        <div>
          {filters.length === 0 ? load() : ""}
          <Grid container spacing={2} style={{ marginBottom: 0 }}>
            <Grid item xs={12}>
              <Card
                elevation={3}
                style={{
                  margin: 10,
                  backgroundColor: "#FAFAFA",
                }}
              >
                <h1 style={{ paddingLeft: 10 }}>GROCERI</h1>
                <Button
                  style={{ marginLeft: 0, margin: 10, height: 56 }}
                  variant="outlined"
                  onClick={() => setStaplesdialog(true)}
                >
                  Staples
                </Button>
                <Button
                  style={{ marginLeft: 0, margin: 10, height: 56 }}
                  variant="outlined"
                  onClick={() => setSettingsdialog(true)}
                >
                  Settings
                </Button>
                {tutorial ? (
                  <div
                    style={{
                      padding: 10,
                      border: "solid",
                      borderColor: "lightgray",
                      borderWidth: 1,
                      borderRadius: 10,
                      margin: 10,
                    }}
                  >
                    <h3>1.Add an Item</h3>
                    <h3>
                      2.Click on the item to assign it to a filter category
                    </h3>
                    <h3>3.Groceri remembers your filters</h3>
                    <h3>
                      4.All weekly/monthly staples that are not on the list get
                      added automatically every 7/30 days
                    </h3>
                    <Button
                      style={{
                        marginLeft: 0,
                        margin: 10,
                      }}
                      variant="outlined"
                      onClick={() => showTutorial()}
                    >
                      Dont show this again
                    </Button>
                  </div>
                ) : (
                  ""
                )}

                <p style={{ color: "#FE5F55" }}>{warning}</p>
                <TextField
                  variant="outlined"
                  style={{ width: "60%", padding: 10, paddingRight: 0 }}
                  type="text"
                  name="input"
                  placeholder="add smth"
                  value={input}
                  onChange={(event) => handleInput(event)}
                  onKeyPress={keyPressed}
                />
                <Button
                  style={{ marginLeft: 0, margin: 10, height: 56 }}
                  variant="outlined"
                  disableElevation
                  onClick={() => updateList()}
                >
                  Add
                </Button>
              </Card>
            </Grid>
            {sorted()}
          </Grid>
          <Staples
            weeklyList={weeklyList}
            monthlyList={monthlyList}
            staples={staplesdialog}
            setWeeklyList={(l) => handleWeeklyList(l)}
            setMonthlyList={(l) => handleMonthlyList(l)}
            setStaples={(f) => setStaplesdialog(f)}
            addStaples={(t) => addStaples(t)}
          />
          <Settings
            settings={settingsdialog}
            user={user}
            giveFeedback={(m) => api.giveFeedback(m)}
            setSettingsdialog={(f) => setSettingsdialog(f)}
          />
        </div>
      ) : (
        <LoginScreen
          user={user}
          validate={(u, p) => validate(u, p)}
          warning={warning}
        />
      )}
    </div>
  );
};

export default App;
