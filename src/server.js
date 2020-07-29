const Express = require('express');
const Http = require("http");
const SocketIO = require("socket.io");
const Session = require("express-session");
const SharedSession = require("express-socket.io-session");
const CryptoRandomString = require("crypto-random-string");

class Server {
    constructor(options, controller) {
        var app = new Express();
        var server = Http.createServer(app);
        app.use(Express.static(options.staticPath));
        var sio = require("socket.io")(server)
        var session = Session(options.session)
        app.use(session);
        sio.use(SharedSession(session));

        this.options = options;
        this.controller = controller;
        this.sio = sio;
        this.server = server;

    }

    async init() {
        this.sio.on("connection", socket => {

            if (socket.handshake.session.address) {
                this.controller.online(socket.handshake.session.address, socket);
            }

            socket.on("preLogin", () => {
                var code = CryptoRandomString({ length: 32 })
                socket.handshake.session.code = code;
                socket.handshake.session.save();
                socket.emit("preLogin", {
                    code: code
                })
            })

            socket.on("login", data => {
                this.controller.check(socket.handshake.session.code, data.signature).then(address => {
                    if (address) {
                        address = address.toLowerCase();
                        socket.handshake.session.address = address;
                        socket.handshake.session.save();
                        this.controller.online(address, socket);
                        socket.emit("logined")
                    } else {
                        socket.emit("login_err")
                    }
                })
            })

            socket.on("logout", () => {
                if (socket.handshake.session.address) {
                    delete socket.handshake.session.address
                    socket.handshake.session.save();
                    this.controller.offline(socket.handshake.session.address, socket);
                }
            })

            socket.on("sendMessage", message => {
                if (socket.handshake.session.address) {
                    this.controller.sendMessage(socket.handshake.session.address, message.to.toLowerCase(), message.content)
                } else {
                    socket.emit("need_login")
                }
            })

            socket.on("getMessages", data => {
                if (socket.handshake.session.address) {
                    this.controller.getMessages(socket.handshake.session.address, data.to, data.lastTime).then(messages => {
                        socket.emit("messages", messages)
                    })
                } else {
                    socket.emit("need_login")
                }
            })

            socket.on("disconnect", () => {
                if (socket.handshake.session.address) {
                    this.controller.offline(socket.handshake.session.address, socket);
                }
            })
        })

        this.server.listen(this.options.port);
        return true;
    }
}

module.exports = Server;