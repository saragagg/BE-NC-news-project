const {
  fetchUsers
} = require("../models/userModels");

function getUsers(req, res, next) {
  fetchUsers().then((users) => {
    res.status(200).send({ users })
  });
}

module.exports = {
  getUsers
};
