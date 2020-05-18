/* Api methods to call /functions */

const validate = (u) => {
  return fetch("/.netlify/functions/validate", {
    body: JSON.stringify({ user: u }),
    method: "POST",
  }).then((response) => {
    //console.log(response.json());
    return response.json();
  });
};

const read = (u) => {
  return fetch("/.netlify/functions/read", {
    body: JSON.stringify(u),
    method: "POST",
  }).then((response) => {
    return response.json();
  });
};
const updateList = (list) => {
  //console.log("went to /api");
  //console.log(list);
  return fetch(`/.netlify/functions/update-list`, {
    method: "POST",
    body: JSON.stringify(list),
  }).then((response) => {
    return response.json();
  });
};

const readFilters = () => {
  return fetch("/.netlify/functions/read-filters").then((response) => {
    return response.json();
  });
};
const updateFilters = (filters) => {
  //console.log("went to /api");
  //console.log(filters);
  return fetch(`/.netlify/functions/update-filters`, {
    method: "POST",
    body: JSON.stringify(filters),
  }).then((response) => {
    return response.json();
  });
};
const updateWeeklyList = (weekly) => {
  //console.log("went to /api");
  //console.log(weekly);
  return fetch(`/.netlify/functions/update-weekly`, {
    method: "POST",
    body: JSON.stringify(weekly),
  }).then((response) => {
    return response.json();
  });
};
const updateMonthlyList = (monthly) => {
  //console.log("went to /api");
  //console.log(monthly);
  return fetch(`/.netlify/functions/update-monthly`, {
    method: "POST",
    body: JSON.stringify(monthly),
  }).then((response) => {
    return response.json();
  });
};
const updateStapleTimer = (t) => {
  //console.log(t);
  return fetch(`/.netlify/functions/update-stapleTimer`, {
    method: "POST",
    body: JSON.stringify(t),
  }).then((response) => {
    return response.json();
  });
};

export default {
  read: read,
  validate: validate,
  updateList: updateList,
  readFilters: readFilters,
  updateFilters: updateFilters,
  updateWeeklyList: updateWeeklyList,
  updateMonthlyList: updateMonthlyList,
  updateStapleTimer: updateStapleTimer,
};
