const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  timestamp: { type: Date, default: Date.now },
  date_created: { type: Date },
  date_created_utc: { type: Date },
});
const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;

module.exports.sendMessage = async (data, callback) => {
  const newMsg = new Message(data);

  // Save the new user to the database
  const savedUser = await newMsg.save();
  callback(savedUser);
};
module.exports.getChatList = async (data, callback) => {
  const conditions = {
    $or: [
      { sender: data?._id },
      { receiver: data?._id },
      // Add more conditions as needed
    ],
  };
  const result = await Message.find(conditions)
    .populate("sender")
    .populate("receiver");
  callback(result);
};
module.exports.getChatHistory = async (data) => {
  const conditions = {
    $or: [
      {
        sender: data.sender,
        receiver: data.receiver,
      },
      {
        sender: data.receiver,
        receiver: data.sender,
      },
    ],
  };
  const result = await Message.find(conditions)
    .populate({
      path: "sender",
      select: "-password",
    })
    .populate({
      path: "receiver",
      select: "-password",
    })
    .sort({ timestamp: -1 })
    .lean();
  return result;
};
