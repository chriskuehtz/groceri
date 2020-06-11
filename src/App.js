import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  ButtonGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import api from "./utils/api.js";
import bcrypt from "bcryptjs";

const App = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loginScreen, setLoginScreen] = useState(true);
  const [list, setList] = useState([]);
  const [filters, setFilters] = useState([]);
  const [item, setItem] = useState("");
  const [warning, setWarning] = useState("");
  const [filterItem, setFilterItem] = useState(null);
  const [staplesMenu, setStaplesMenu] = useState(false);
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [weeklyItem, setWeeklyItem] = useState("");
  const [monthlyItem, setMonthlyItem] = useState("");
  const [weeklyTimer, setWeeklyTimer] = useState("");
  const [monthlyTimer, setMonthlyTimer] = useState("");

  //styles:
  const fullscreen = {
    position: "absolute",
    top: 0,
    left: 0,
    minHeight: "100vh",
    heigth: "100%",
    width: "100vw",
    backgroundColor: "#264653",
  };
  const card = {
    backgroundColor: "white",
    width: "96%",
    margin: "2%",
  };
  const cardHeader = {
    marginLeft: "2%",
  };
  const bigCard = {
    backgroundColor: "white",
    margin: "2%",
  };
  const inputElement = {
    width: "96%",
    fontSize: "4vh",
    margin: "2%",
  };
  const functionButton = {
    width: "96%",
    fontSize: "4vh",
    margin: "2%",
  };
  const categoryButton = {
    backgroundColor: "white",
    color: "black",
    width: "96%",
    fontSize: "4vh",
    margin: "2%",
  };
  const buttonGroup = { width: "96%", margin: "2%" };
  const itemButton = { width: "80%" };
  const deleteButton = { width: "20%" };

  //load the data upon login
  const fetchData = async (u) => {
    const result = await api.read(u);
    console.log(result);
    setList(result.data.list);
    setFilters(result.data.filters);
    setWeekly(result.data.weekly);
    setMonthly(result.data.monthly);
    setWeeklyTimer(result.data.weeklyTimer);
    setMonthlyTimer(result.data.monthlyTimer);
    /*if (new Date().getTime() > weeklyTimer + 7 * 24 * 60 * 60 * 1000) {
      triggerUpdate(
        list.concat(weekly.filter((w) => list.includes(w) === false)),
        "listWeekly"
      );
    }
    if (new Date().getTime() > monthlyTimer + 30 * 24 * 60 * 60 * 1000) {
      triggerUpdate(
        list.concat(monthly.filter((m) => list.includes(m) === false)),
        "listMonthly"
      );
    }*/
  };
  const triggerUpdate = async (parameter, name) => {
    let data = {
      users: ["chris", "icia"],
      list: list,
      weekly: weekly,
      monthly: monthly,
      weeklyTimer: weeklyTimer,
      monthlyTimer: monthlyTimer,
      filters: filters,
    };
    if (name === "list") {
      data.list = parameter;
    } else if (name === "filters") {
      data.filters = parameter;
    } else if (name === "weekly") {
      data.weekly = parameter;
    } else if (name === "monthly") {
      data.monthly = parameter;
    } else if (name === "listWeekly") {
      data.list = parameter;
      data.weeklyTimer = new Date().getTime();
    } else if (name === "listMonthly") {
      data.list = parameter;
      data.monthlyTimer = new Date().getTime();
    }
    const result = await api.update({
      ref: "265547352335450635",
      data: data,
    });
    console.log("received");
    console.log(result.data);
    setList(result.data.list);
    setFilters(result.data.filters);
    setWeekly(result.data.weekly);
    setMonthly(result.data.monthly);
    setWeeklyTimer(result.data.weeklyTimer);
    setMonthlyTimer(result.data.monthlyTimer);
  };
  const validate = async (u, p) => {
    const result = await api.validate(u);
    if (bcrypt.compareSync(p, result.hash)) {
      console.log("password correct");
      fetchData(u);
      setLoginScreen(false);
      setWarning("");
    } else {
      setWarning("wrong user or password");
    }
  };
  //add an item to the list
  const addItem = () => {
    //perform api.update with the list with the new item
    const concatItem = () => {
      if (item !== "") {
        let temp = item.toLowerCase();
        let tempList = list.concat(temp);
        setItem("");
        setWarning("");
        triggerUpdate(tempList, "list");
      } else {
        setWarning("you cannot add an empty Item");
      }
    };
    //return the input field
    return (
      <Col xs="12">
        <Card style={bigCard}>
          <h1 style={cardHeader}>GROCERI</h1>
          <Input
            style={inputElement}
            placeholder="add smth"
            value={item}
            onChange={(event) => setItem(event.target.value)}
          />
          <Button
            outline
            color="dark"
            style={functionButton}
            onClick={() => concatItem()}
          >
            Add
          </Button>
        </Card>
      </Col>
    );
  };
  //perform api.update with the list without the deleted item
  const deleteItem = (item) => {
    console.log(item);
    let temp = list.filter((e) => e !== item);
    triggerUpdate(temp, "list");
  };
  const deleteWeekly = (item) => {
    console.log(item);
    let temp = weekly.filter((e) => e !== item);
    triggerUpdate(temp, "weekly");
  };
  const deleteMonthly = (item) => {
    console.log(item);
    let temp = monthly.filter((e) => e !== item);
    triggerUpdate(temp, "monthly");
  };
  //map the list according to filter category
  const mapFilters = () => {
    //temp variable because everything that does not belong in a filter goes in the "other" filter
    let tempList = [].concat(list);
    let tempFilters = [];

    filters.forEach((f) => {
      if (f[0] === "OTHER") {
        let tempFilter = [];
        tempFilter.push(f[0]);
        tempFilter = tempFilter.concat(tempList);
        tempFilters.push(tempFilter);
      } else {
        let tempFilter = [];
        tempFilter.push(f[0]);
        tempFilter = tempFilter.concat(f.filter((e) => tempList.includes(e)));
        tempList = tempList.filter((e) => tempFilter.includes(e) === false);
        tempFilters.push(tempFilter);
      }
    });
    return (
      <Row style={fullscreen}>
        {addItem()}{" "}
        {tempFilters
          .filter((f) => f.length > 1)
          .map((f) => (
            <Col xs="12" lg="6">
              <Card style={card}>
                <h3 style={cardHeader}>{f[0]}</h3>
                {f.slice(1).map((e) => (
                  <ButtonGroup outline style={buttonGroup}>
                    <Button
                      outline
                      color="dark"
                      style={itemButton}
                      onClick={() => setFilterItem(e)}
                    >
                      {e}
                    </Button>
                    <Button
                      outline
                      color="danger"
                      style={deleteButton}
                      onClick={() => deleteItem(e)}
                    >
                      X
                    </Button>
                  </ButtonGroup>
                ))}
              </Card>
            </Col>
          ))}
        <Col xs="12">
          <Button
            color="danger"
            style={functionButton}
            onClick={() => setStaplesMenu(true)}
          >
            Staples
          </Button>
        </Col>
      </Row>
    );
  };
  //perform api.update with the filters with the new item
  const assignFilter = (item, filterIndex) => {
    //copy of filters
    let tempFilters = [].concat(filters);
    //remove item from its current filter category
    tempFilters = tempFilters.map((f) => f.filter((e) => e !== item));
    //push item into the new category
    tempFilters[filterIndex].push(item);
    setFilterItem(null);
    triggerUpdate(tempFilters, "filters");
  };
  const showFilterMenu = () => {
    if (filterItem !== null) {
      return (
        <Row style={fullscreen}>
          <Col xs="12">
            <Card style={card}>
              <h1 style={cardHeader}>{filterItem}</h1>
            </Card>
          </Col>

          {filters.map((f, i) => (
            <Col xs="12" lg="2">
              <Button
                style={categoryButton}
                onClick={() => assignFilter(filterItem, i)}
              >
                <p>{f[0]}</p>
              </Button>
            </Col>
          ))}
          <Col xs="12">
            <Button
              color="danger"
              style={functionButton}
              onClick={() => setFilterItem(null)}
            >
              Back
            </Button>
          </Col>
        </Row>
      );
    } else {
      return;
    }
  };
  const showStaplesMenu = () => {
    const concatStaple = (s) => {
      if (s === "weekly" && weeklyItem !== "") {
        let temp = weeklyItem.toLowerCase();
        let tempList = weekly;
        tempList = tempList.concat(temp);
        setWeeklyItem("");
        setWarning("");
        triggerUpdate(tempList, s);
      } else if (s === "monthly" && monthlyItem !== "") {
        let temp = monthlyItem.toLowerCase();
        let tempList = monthly;
        tempList = tempList.concat(temp);
        setMonthlyItem("");
        setWarning("");
        triggerUpdate(tempList, s);
      } else {
        setWarning("you cannot add an empty Item");
      }
    };

    return (
      <Row style={fullscreen}>
        <Col xs="12">
          <Card style={card}>
            <h1 style={cardHeader}>Weekly</h1>
            <Input
              style={inputElement}
              placeholder="add smth"
              value={weeklyItem}
              onChange={(event) => setWeeklyItem(event.target.value)}
            />
            <Button
              outline
              color="dark"
              style={functionButton}
              onClick={() => concatStaple("weekly")}
            >
              Add
            </Button>
            {weekly.map((e) => (
              <ButtonGroup outline style={buttonGroup}>
                <Button outline color="dark" style={itemButton}>
                  {e}
                </Button>
                <Button
                  outline
                  color="danger"
                  style={deleteButton}
                  onClick={() => deleteWeekly(e)}
                >
                  X
                </Button>
              </ButtonGroup>
            ))}
            <Button
              outline
              color="dark"
              style={functionButton}
              onClick={() =>
                triggerUpdate(
                  list.concat(weekly.filter((w) => list.includes(w) === false)),
                  "listWeekly"
                )
              }
            >
              Add all weekly Staples
            </Button>
            <Button disabled style={categoryButton}>
              weekly Staples will be added automatically on{" "}
              {new Date(weeklyTimer + 7 * 24 * 60 * 60 * 1000).toDateString()}
            </Button>
          </Card>
        </Col>
        <Col xs="12">
          <Card style={card}>
            <h1 style={cardHeader}>Monthly</h1>
            <Input
              style={inputElement}
              placeholder="add smth"
              value={monthlyItem}
              onChange={(event) => setMonthlyItem(event.target.value)}
            />
            <Button
              outline
              color="dark"
              style={functionButton}
              onClick={() => concatStaple("monthly")}
            >
              Add
            </Button>
            {monthly.map((e) => (
              <ButtonGroup outline style={buttonGroup}>
                <Button outline color="dark" style={itemButton}>
                  {e}
                </Button>
                <Button
                  outline
                  color="danger"
                  style={deleteButton}
                  onClick={() => deleteMonthly(e)}
                >
                  X
                </Button>
              </ButtonGroup>
            ))}
            <Button
              outline
              color="dark"
              style={functionButton}
              onClick={() =>
                triggerUpdate(
                  list.concat(
                    monthly.filter((m) => list.includes(m) === false)
                  ),
                  "listMonthly"
                )
              }
            >
              Add all monthly Staples
            </Button>
            <Button disabled style={categoryButton}>
              monthly Staples will be added automatically on{" "}
              {new Date(monthlyTimer + 30 * 24 * 60 * 60 * 1000).toDateString()}
            </Button>
          </Card>
        </Col>
        <Col xs="12">
          <Button
            style={functionButton}
            color="danger"
            onClick={() => setStaplesMenu(false)}
          >
            back
          </Button>
        </Col>
      </Row>
    );
  };
  const showLoginScreen = () => {
    if (loginScreen === true) {
      return (
        <Row style={fullscreen}>
          <Col xs="12">
            <Card style={{ marginTop: "20%", width: "90%", marginLeft: "5%" }}>
              <h1 style={cardHeader}>GROCERI</h1>
              <h4 style={cardHeader}>organize your grocery shopping!</h4>
              <Input
                style={inputElement}
                placeholder="user"
                value={user}
                onChange={(event) => setUser(event.target.value)}
              />
              <Input
                style={inputElement}
                type="password"
                placeholder="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Button
                color="danger"
                style={functionButton}
                onClick={() => validate(user, password)}
              >
                Log in
              </Button>
              <p>{warning}</p>
            </Card>
          </Col>
        </Row>
      );
    } else return "";
  };
  //return the warning, or "nothing"
  const showWarning = () => {
    return (
      <Col style={{ color: "red" }} xs="12">
        {warning}
      </Col>
    );
  };

  //return of App
  return (
    <Container fluid>
      {loginScreen === true
        ? showLoginScreen()
        : filterItem === null
        ? staplesMenu === false
          ? mapFilters()
          : showStaplesMenu()
        : showFilterMenu()}
    </Container>
  );
};
export default App;

/**{showStaplesMenu()}
          {showWarning()}{showFilterMenu()} */
