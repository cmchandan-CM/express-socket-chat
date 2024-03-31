const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});

const User = mongoose.model("User", userSchema);
module.exports = User;

module.exports.addUser = async (data, callback) => {
  // Create a new user instance
  if (!data.username && !data.password) {
    callback({ status: false, message: "all field are required" });
  }
  const foundUser = await User.findOne({ username: data.username });
  if (foundUser) {
    if (foundUser.password === data.password) {
      callback({
        status: true,
        message: "Login successfully",
        userData: foundUser,
      });
    } else {
      callback({
        status: false,
        message: "Password is invalid.",
      });
    }
  } else {
    try {
      const newUser = new User({
        username: data.username,
        password: data.password,
        // Note: In a real-world application, this should be a hashed and salted password
      });

      // Save the new user to the database

      const savedUser = await newUser.save();
      callback({
        status: true,
        message: "Suceesfully added",
        userData: savedUser,
        new: true,
      });
    } catch (err) {
      console.log(err.message);
      callback({
        status: false,
        message: err.message,
      });
    }
  }

  console.log("object");
};
module.exports.userList = async (callback) => {
  // Create a new user instance

  const userList = await User.find({}).select("-password -email");
  callback({
    status: true,
    message: "User List fetched successfully",
    userList: userList,
  });
};
