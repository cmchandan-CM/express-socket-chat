const express = require("express");
const mainControllers = require("../controller/mainControllers");
const router = express.Router();
router.post("/login", mainControllers.onLogin);
router.post("/chatlist", mainControllers.getChatList);
router.get("/userlist", mainControllers.userList);

module.exports = router;
