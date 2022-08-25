const User = require("./models/User");
const Chat = require("./models/Chat");
const Game = require("./models/Game");
const Message = require("./models/Message");

const { customAlphabet } = require("nanoid");
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10);

module.exports = {
  handleError: function (error, res) {
    if (typeof error === "string") {
      let [code, message] = error.split("/");
      code = Number(code);
      res.status(code).json(message);
    } else {
      res.status(400).json(error.message);
    }
  },

  generateID: function () {
    return nanoid();
  },

  getUser: async function (uid) {
    const user = await User.findById(uid);
    if (!user) throw "404/user not found";
    return user;
  },

  getChat: async function (id) {
    const chat = await Chat.findById(id);
    if (!chat) throw "404/chat not found";
    return chat;
  },

  getGame: async function (id) {
    const game = await Game.findById(id);
    if (!game) throw "404/game not found";
    return game;
  },

  createMessage: function (text, username, uid) {
    const message = new Message({ text, username, uid });
    return message;
  },

  checkValidPlayer: function (uid, game) {
    if (uid !== game.pwhite.uid && uid !== game.pblack.uid)
      throw "403/uid doesn't match both players";
    if (
      (game.turn === "w" && game.pwhite.uid === uid) ||
      (game.turn === "b" && game.pblack.uid === uid)
    ) {
      return true;
    }
    throw "400/mismatch data";
  },
};
