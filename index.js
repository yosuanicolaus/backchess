const apiServer = require("./app");
const socketServer = require("./socket");

const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    apiServer.listen(port, () => {
      console.log(`API server listening on port ${port}`);
    });

    socketServer.listen(port, () => {
      console.log(`SocketIO server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
