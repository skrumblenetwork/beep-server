const Config = require("../config");
const DataBase = require("./database");
const BlockChain = require("./blockchain");
const Controller = require("./controller");
const Server = require("./server");


async function startApp() {
    var config = await Config.init();
    var database = await new DataBase(config.database).init();
    var blockchain = await new BlockChain(config.blockchain).init();
    var controller = await new Controller(database, blockchain).init();
    new Server(config.server, controller).init();
}


startApp();