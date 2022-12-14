const User = require("./models/User");
const Chat = require("./models/Chat");
const Game = require("./models/Game");
const Message = require("./models/Message");

const {
  uniqueNamesGenerator,
  adjectives,
  animals,
} = require("unique-names-generator");

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

  generateName: function () {
    let name = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      style: "capital",
      separator: "",
    });
    name += Math.floor(Math.random() * 99).toString();
    return name;
  },

  getUser: async function (uid) {
    const user = await User.findById(uid);
    return user;
  },

  getChat: async function (id) {
    const chat = await Chat.findById(id);
    return chat;
  },

  getGame: async function (id) {
    const game = await Game.findById(id);
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
