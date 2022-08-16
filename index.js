const apiServer = require("./app");
const socketServer = require("./socket");

const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    apiServer.listen(3001, () => {
      console.log("API server listening on port 3001");
    });

    socketServer.listen(3003, () => {
      console.log("SocketIO server listening on port 3003");
    });
  })
  .catch((err) => {
    console.log(err);
  });
