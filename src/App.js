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
    console.log(u, p);
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
        <Card className="bigCard">
          <h1 className="cardHeader">GROCERI</h1>
          <Input
            className="inputElement"
            placeholder="add smth"
            value={item}
            onChange={(event) => setItem(event.target.value)}
            onKeyPress={keyPressed}
          />
          <Button
            outline
            color="dark"
            className="functionButton"
            block
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
      <Row>
        {addItem()}{" "}
        {tempFilters
          .filter((f) => f.length > 1)
          .map((f) => (
            <Col xs="12" md="6" lg="4">
              <Card className="smallCard">
                <h3 className="cardHeader">{f[0]}</h3>
                {f.slice(1).map((e) => (
                  <ButtonGroup outline className="buttonGroup">
                    <Button
                      outline
                      color="dark"
                      className="itemButton"
                      onClick={() => setFilterItem(e)}
                    >
                      {e}
                    </Button>
                    <Button
                      outline
                      color="danger"
                      className="deleteButton"
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
            className="functionButton"
            block
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
        <Row>
          <Col xs="12">
            <Card className="smallCard">
              <h1 className="cardHeader">{filterItem}</h1>
              <Row>
                {filters.map((f, i) => (
                  <Col xs="12" md="4" xl="3" className="category">
                    <Button
                      className="categoryButton"
                      block
                      outline
                      color="dark"
                      onClick={() => assignFilter(filterItem, i)}
                    >
                      <span>{f[0]}</span>
                    </Button>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          <Col xs="12">
            <Button
              color="danger"
              className="functionButton"
              block
              block
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
      <Row>
        <Col xs="12">
          <Card className="smallCard">
            <h1 className="cardHeader">Weekly</h1>
            <Input
              className="inputElement"
              placeholder="add smth"
              value={weeklyItem}
              onChange={(event) => setWeeklyItem(event.target.value)}
              onKeyPress={keyPressedWeekly}
            />
            <Button
              outline
              color="dark"
              className="functionButton"
              block
              onClick={() => concatStaple("addWeekly")}
            >
              Add
            </Button>
            {weekly.map((e) => (
              <ButtonGroup outline className="buttonGroup">
                <Button outline color="dark" className="itemButton">
                  {e}
                </Button>
                <Button
                  outline
                  color="danger"
                  className="deleteButton"
                  onClick={() => deleteWeekly(e)}
                >
                  X
                </Button>
              </ButtonGroup>
            ))}
            <Button
              outline
              color="dark"
              className="functionButton"
              block
              onClick={() => triggerUpdate(weekly, "listWeekly")}
            >
              Add all weekly Staples
            </Button>
            <Button disabled className="categoryButton">
              weekly Staples will be added automatically on{" "}
              {new Date(weeklyTimer + 7 * 24 * 60 * 60 * 1000).toDateString()}
            </Button>
          </Card>
        </Col>
        <Col xs="12">
          <Card className="smallCard">
            <h1 className="cardHeader">Monthly</h1>
            <Input
              className="inputElement"
              placeholder="add smth"
              value={monthlyItem}
              onChange={(event) => setMonthlyItem(event.target.value)}
              onKeyPress={keyPressedMonthly}
            />
            <Button
              outline
              color="dark"
              className="functionButton"
              block
              onClick={() => concatStaple("addMonthly")}
            >
              Add
            </Button>
            {monthly.map((e) => (
              <ButtonGroup outline className="buttonGroup">
                <Button outline color="dark" className="itemButton">
                  {e}
                </Button>
                <Button
                  outline
                  color="danger"
                  className="deleteButton"
                  onClick={() => deleteMonthly(e)}
                >
                  X
                </Button>
              </ButtonGroup>
            ))}
            <Button
              outline
              color="dark"
              className="functionButton"
              block
              onClick={() => triggerUpdate(monthly, "listMonthly")}
            >
              Add all monthly Staples
            </Button>
            <Button disabled className="categoryButton">
              monthly Staples will be added automatically on{" "}
              {new Date(monthlyTimer + 30 * 24 * 60 * 60 * 1000).toDateString()}
            </Button>
          </Card>
        </Col>
        <Col xs="12">
          <Button
            className="functionButton"
            block
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
        <Row>
          <Col xs="12">
            <Card className="loginCard">
              <h1 className="cardHeader">GROCERI</h1>
              <h4 className="cardHeader">organize your grocery shopping!</h4>
              <Input
                className="inputElement"
                placeholder="user"
                value={user}
                onChange={(event) => setUser(event.target.value)}
              />
              <Input
                className="inputElement"
                type="password"
                placeholder="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Button
                color="danger"
                className="functionButton"
                block
                onClick={() => validate(user, password)}
              >
                Log in
              </Button>
              <h3 className="warning">{warning}</h3>
            </Card>
          </Col>
        </Row>
      );
    } else return "";
  };

  //return of App, "routing" through ternary operator
  return (
    <Container className="box">
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
