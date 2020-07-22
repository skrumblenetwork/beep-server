var path = require("path")
var mkdirp = require("mkdirp");

var runtimeDir = path.join(__dirname, "runtime");

var config = {
    database: {
        dialect: 'sqlite',
        storage: path.join(runtimeDir, 'database.sqlite'),
        logging: false
    },
    blockchain: {
        providerType: "http",
        providerPath: "http://127.0.0.1:10101"
    },
    server: {
        port: 8080,
        staticPath: path.join(runtimeDir, 'static'),
        session: {
            secret: "boot-server-key",
            resave: true,
            saveUninitialized: true
        }
    }
}


exports.init = async function () {
    await mkdirp(runtimeDir);
    return config;
}