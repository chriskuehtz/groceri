import React, { useState } from "react";
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
  const [users, setUsers] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const [ref, setRef] = useState("");
  const [loginScreen, setLoginScreen] = useState(true);
  const [list, setList] = useState([]);
  const [filters, setFilters] = useState([]);
  const [item, setItem] = useState("");
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
    setUsers(result.data.users);
    setRef(result.data.ref);
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
  //trigger netlify function to perform the database update
  const triggerUpdate = async (parameter, name) => {
    console.log(parameter);
    //fetch the latest state of the db(if you share the list with someone)

    const read = await api.read(user);

    let data = {
      users: users,
      list: list,
      weekly: weekly,
      monthly: monthly,
      weeklyTimer: weeklyTimer,
      monthlyTimer: monthlyTimer,
      filters: filters,
    };

    if (name === "list") {
      data.list = parameter;
    } else if (name === "addItem") {
      data.list = read.data.list.concat(parameter);
    } else if (name === "deleteItem") {
      data.list = read.data.list.filter((e) => e !== parameter);
    } else if (name === "deleteWeekly") {
      data.list = read.data.weekly.filter((e) => e !== parameter);
    } else if (name === "deleteMonthly") {
      data.list = read.data.monthly.filter((e) => e !== parameter);
    } else if (name === "addWeekly") {
      data.weekly = read.data.weekly.concat(parameter);
    } else if (name === "addMonthly") {
      data.monthly = read.data.monthly.concat(parameter);
    } else if (name === "listWeekly" || name === "listMonthly") {
      data.list = read.data.list.concat(
        parameter.filter((m) => read.data.list.includes(m) === false)
      );
      data.weeklyTimer = new Date().getTime();
    } else if (name === "filters") {
      data.filters = parameter;
    }
    const result = await api.update({
      ref: ref,
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
    console.log(result);
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
    const keyPressed = (event) => {
      if (event.key === "Enter" && item !== "") {
        concatItem();
      }
    };
    const concatItem = () => {
      if (item !== "") {
        let temp = item.toLowerCase();
        //let tempList = list.concat(temp);
        setItem("");
        setWarning("");
        triggerUpdate(temp, "addItem");
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
            onKeyPress={keyPressed}
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
    //let temp = list.filter((e) => e !== item);
    triggerUpdate(item, "deleteItem");
  };
  const deleteWeekly = (item) => {
    console.log(item);
    let temp = weekly.filter((e) => e !== item);
    triggerUpdate(item, "deleteWeekly");
  };
  const deleteMonthly = (item) => {
    console.log(item);
    //let temp = monthly.filter((e) => e !== item);
    triggerUpdate(item, "deleteMonthly");
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
  //the actual jsx components: (all in one file because it is not a lot of code)
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
      if (s === "addWeekly" && weeklyItem !== "") {
        let temp = weeklyItem.toLowerCase();
        //let tempList = weekly;
        //tempList = tempList.concat(temp);
        setWeeklyItem("");
        setWarning("");
        triggerUpdate(temp, s);
      } else if (s === "addMonthly" && monthlyItem !== "") {
        let temp = monthlyItem.toLowerCase();
        //let tempList = monthly;
        //tempList = tempList.concat(temp);
        setMonthlyItem("");
        setWarning("");
        triggerUpdate(temp, s);
      } else {
        setWarning("you cannot add an empty Item");
      }
    };
    const keyPressedWeekly = (event) => {
      if (event.key === "Enter" && weeklyItem !== "") {
        concatStaple("addWeekly");
      }
    };
    const keyPressedMonthly = (event) => {
      if (event.key === "Enter" && monthlyItem !== "") {
        concatStaple("addMonthly");
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
              onKeyPress={keyPressedWeekly}
            />
            <Button
              outline
              color="dark"
              style={functionButton}
              onClick={() => concatStaple("addWeekly")}
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
              onClick={() => triggerUpdate(weekly, "listWeekly")}
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
              onKeyPress={keyPressedMonthly}
            />
            <Button
              outline
              color="dark"
              style={functionButton}
              onClick={() => concatStaple("addMonthly")}
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
              onClick={() => triggerUpdate(monthly, "listMonthly")}
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
              <h3 style={{ color: "red" }}>{warning}</h3>
            </Card>
          </Col>
        </Row>
      );
    } else return "";
  };

  //return of App, "routing" through ternary operator
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
