const { getChatList } = require("../models/message");
const { addUser, userList } = require("../models/user");

module.exports = {
  onLogin: async (req, res) => {
    addUser(req.body, (result) => {
      res.json(result);
    });
  },
  getChatList: async (req, res) => {
    console.log(req.body);

    getChatList(req.body, (result) => {
      console.log(result);
      res.json(result);
    });
  },
  userList: async (req, res) => {
    console.log("userlist");
    userList((result) => {
      console.log(result);
      res.json(result);
    });
  },
};
