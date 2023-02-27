# Backchess

Backchess is a backend API + socket server that connects the LogiChess chess library with Database and SocketIO, providing the capability to have a stateful game by simply using the API.

Example game:
https://desolate-caverns-62809.herokuapp.com/game/AO3NWGqmKz

```javascript
{
  "_id": "AO3NWGqmKz",
  "timeControl": "180+180",
  "state": "playing",
  "board": [
    ["r", "n", "b", "q", "k", "b", ".", "r"],
    ["p", "p", "p", ".", "p", "p", "p", "p"],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", "N", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    ["P", "P", "P", "P", ".", "P", "P", "P"],
    ["R", ".", "B", "Q", "K", "B", "N", "R"]
  ],
  "moves": [
    {
      "from": { "rank": 0, "file": 1 },
      "to": { "rank": 2, "file": 2 },
      "piece": "n",
      "faction": "b",
      "san": "Nc6",
      "lan": "Nb8c6",
      "uci": "b8c6",
      "fenResult": "r1bqkb1r/ppp1pppp/2n5/3N4/8/8/PPPP1PPP/R1BQKBNR w KQkq - 1 5"
    },
    {
      "from": { "rank": 0, "file": 1 },
      "to": { "rank": 1, "file": 3 },
      "piece": "n",
      "faction": "b",
      "san": "Nd7",
      "lan": "Nb8d7",
      "uci": "b8d7",
      "fenResult": "r1bqkb1r/pppnpppp/8/3N4/8/8/PPPP1PPP/R1BQKBNR w KQkq - 1 5"
    },
    // ... 20+ more available moves below
  ],
  "history": ["e4", "d5", "exd5", "Nf6", "Nc3", "Nxd5", "Nxd5"],
  "records": [
    1662108080920, 1662108091840, 1662108099914, 1662108114111, 1662108131897,
    1662108137026, 1662108145335, 1662108148515
  ],
  "chat": "6311c195f2e6f85b83ba769b",
  "createdAt": "2022-09-02T08:40:53.559Z",
  "updatedAt": "2022-09-02T08:42:40.489Z",
  "__v": 8,
  "user0": {
    "_id": "d338X9kDY6d5gSW7NAjybzzeRjL2",
    "uid": "d338X9kDY6d5gSW7NAjybzzeRjL2",
    "name": "MaleMuskox50",
    "elo": 800,
    "updatedAt": "2022-09-02T08:40:54.017Z",
    "createdAt": "2022-09-02T08:40:54.017Z",
    "__v": 0
  },
  "user1": {
    "_id": "UqJRg2opWQcphurC7x2nDcgxgTp1",
    "uid": "UqJRg2opWQcphurC7x2nDcgxgTp1",
    "name": "AgreeableSalamander82",
    "elo": 800,
    "updatedAt": "2022-09-02T08:40:57.300Z",
    "createdAt": "2022-09-02T08:40:57.300Z",
    "__v": 0
  },
    "_id": "d338X9kDY6d5gSW7NAjybzzeRjL2",
    "name": "MaleMuskox50",
    "elo": 800,
    "uid": "d338X9kDY6d5gSW7NAjybzzeRjL2",
    "online": false,
    "active": true,
    "time": 11305831
  },
  "pwhite": {
    "_id": "UqJRg2opWQcphurC7x2nDcgxgTp1",
    "name": "AgreeableSalamander82",
    "elo": 800,
    "uid": "UqJRg2opWQcphurC7x2nDcgxgTp1",
    "online": false,
    "active": false,
    "time": 11486574
  },
  "status": "normal",
  "turn": "b",
  "pgn": "1. e4 d5 2. exd5 Nf6 3. Nc3 Nxd5 4. Nxd5"
}
```

## Tech Stack

- Node JS
- Express
- Mongoose
- MongoDB
- Socket io

## Installation

To use Backchess, simply start interacting with the API with a GET/POST requests. No installation is necessary.

## Usage

Backchess provides a RESTful API with 3 major endpoints: /game, /user, and /chat.
Below are a few examples of some of the endpoints Backchess API provide you.

- `POST /game/new`: starts a new game and returns the new game object
- `GET /game/<gameID>`: get info about a game (as shown in the example above)
- `POST /game/<gameID>/join`: join a game using the uid in the post body
- `POST /user/new`: create a new user and returns its object
- `POST /game/<gameID>/start`: start the game (with some conditions)
- `GET /chat/<chatID>`: get the full chat object based on its id

All responses are in JSON format.
The API will handle the game room, user, and chat CRUD operation, while the Socket Server will handle the actual game play.
For more details about how to use Backchess, [Read the DEMO.md file](https://github.com/yosuanicolaus/backchess/blob/main/DEMO.md)

## Contributing

Contributions are welcome. If you have suggestions for how to improve Backchess, please open an issue or a pull request.

## Credits / License

Backchess was created by [Yosua Nicolaus](https://github.com/yosuanicolaus) and is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License. It uses the [LogiChess chess library](https://github.com/yosuanicolaus/logichess) and is hosted on [Heroku](https://www.heroku.com/).
