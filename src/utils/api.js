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
const changePW = (u) => {
  return fetch("/.netlify/functions/changePW", {
    body: JSON.stringify(u),
    method: "POST",
  }).then((response) => {
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
const update = (l) => {
  //console.log("went to /api");
  //console.log(list);
  return fetch(`/.netlify/functions/update`, {
    method: "POST",
    body: JSON.stringify(l),
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
const giveFeedback = (f) => {
  return fetch(`/.netlify/functions/giveFeedback`, {
    method: "POST",
    body: JSON.stringify(f),
  }).then((response) => {
    return response.json();
  });
};
const showTutorial = (s) => {
  return fetch(`/.netlify/functions/showTutorial`, {
    method: "POST",
    body: JSON.stringify(s),
  }).then((response) => {
    return response.json();
  });
};

export default {
  read: read,
  validate: validate,
  update: update,
  updateStapleTimer: updateStapleTimer,
  giveFeedback: giveFeedback,
  showTutorial: showTutorial,
  changePW: changePW,
};
