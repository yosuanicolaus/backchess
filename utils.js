const User = require("./models/User");

function err(message) {
  return { message };
}

module.exports = {
  createPgn: function (history) {
    let turn = 1;
    let half = true;
    let pgn = [];

    history.forEach((san) => {
      if (half) {
        pgn.push(`${turn}.`, san);
      } else {
        pgn.push(san);
        turn++;
      }
      half = !half;
    });

    return pgn.join(" ");
  },

  createUser: function (user) {
    if (!user) throw err("missing {user}");
    if (!user.name) throw err("missing {name} in user");
    if (!user.uid) throw err("missing {uid} in user");
    if (!user.elo) user.elo = 800;

    const newUser = new User(user);
    return newUser;
  },
};
