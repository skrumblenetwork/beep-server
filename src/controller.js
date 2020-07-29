class Controller {

    constructor(database, blockchain) {
        this.database = database;
        this.blockchain = blockchain;
    }

    async check(code, signature) {
        var address = this.blockchain.recover(code, signature);
        var userInfo = await this.blockchain.getUserInfo(address);
        if (!userInfo) {
            return false;
        }
        return address;
    }

    online(address, socket) {
        this.onlineUsers[address] = socket;
    }

    offline(address) {
        delete this.onlineUsers[address];
    }

    async sendMessage(from, to, content) {
        var time = Math.round(new Date().getTime() / 1000);
        await this.database.addMessage(from, to, content, time)
        if (this.onlineUsers[to]) {
            this.onlineUsers[to].emit("messages", [{
                from: from,
                to: to,
                content: content,
                timestamps: time
            }])
        }
    }

    async getMessages(from, to, lastTime) {
        return await this.database.getMessages(from, to, lastTime);
    }

    async init() {
        this.onlineUsers = {};
        return this;
    }
}

module.exports = Controller;