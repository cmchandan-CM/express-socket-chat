const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const logger = require("morgan");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/mainRoutes");
const { sendMessage, getChatHistory } = require("./models/message");
const PORT = 3031;
app.use(cors());
app.use(bodyParser.json({ limit: "150mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(logger("dev"));
const connectionParams = {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(
    "mongodb+srv://cmchandan:7DJ36x0oZjkY5hSn@cluster0.y0ckc.mongodb.net/socketchat?retryWrites=true&w=majority",
    connectionParams
  )
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: true,
  // origin: "https://firecamp.dev",
  // origins: ["http://localhost:3031", "https://firecamp.dev/"],
});
io.on("connection", (socket) => {
  console.log("SOCKET CONNECTED");
  socket.on("sendMessage", (data) => {
    console.log("sendMessage", data, data?.receiver);

    sendMessage(data, (res) => {
      socket.to(data?.receiver).emit("onMessage", { ...data, _id: res?._id });
    });
  });
  socket.on("getChatHistory", async (data, callback) => {
    const res = await getChatHistory(data);
    callback({
      status: true,
      data: res,
    });
  });
  socket.on("join", (data) => {
    console.log("joined room", data);
    socket.join(data?.id);
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});

app.get("/", function (req, res) {
  res.send("index.html");
});
http.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running,and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
app.use("/api", apiRoutes);
