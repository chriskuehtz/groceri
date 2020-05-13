/* Api methods to call /functions */

const create = (data) => {
  return fetch("/.netlify/functions/todos-create", {
    body: JSON.stringify(data),
    method: "POST",
  }).then((response) => {
    return response.json();
  });
};

const readList = () => {
  return fetch("/.netlify/functions/read-list").then((response) => {
    return response.json();
  });
};
const updateList = (list) => {
  console.log("went to /api");
  console.log(list);
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
  console.log("went to /api");
  console.log(filters);
  return fetch(`/.netlify/functions/update-filters`, {
    method: "POST",
    body: JSON.stringify(filters),
  }).then((response) => {
    return response.json();
  });
};

export default {
  readList: readList,
  updateList: updateList,
  readFilters: readFilters,
  updateFilters: updateFilters,
};
