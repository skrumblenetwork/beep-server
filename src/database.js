const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class DataBase {

    constructor(options) {
        options.define = {
            timestamps: false
        }
        this.sequelize = new Sequelize(options);
        this.messageModel = this.sequelize.define('message', {
            from: {
                type: Sequelize.STRING(42)
            },
            to: {
                type: Sequelize.STRING(42)
            },
            content: {
                type: Sequelize.TEXT
            },
            timestamps: {
                type: Sequelize.INTEGER
            }
        });
    }

    async getMessages(from, to, lastTime) {
        if (!lastTime) {
            lastTime = 0
        }

        var messages = [];

        var fromMessages = await this.messageModel.findAll({
            where: {
                from: from,
                to: to,
                timestamps: {
                    [Op.gte]: lastTime
                }
            },
            raw: true
        })

        fromMessages.forEach(element => {
            messages.push(element);
        });

        var toMessages = await this.messageModel.findAll({
            where: {
                from: to,
                to: from,
                timestamps: {
                    [Op.gte]: lastTime
                }
            },
            raw: true
        })

        toMessages.forEach(element => {
            messages.push(element);
        });
        messages
            .sort(function (a, b) {
                return a.id - b.id;
            }).sort(function (a, b) {
                return a.timestamps - b.timestamps;
            })
        return messages;
    }

    async addMessage(from, to, content, timestamps) {
        return await this.messageModel.create({
            from: from,
            to: to,
            content: content,
            timestamps: timestamps
        })
    }

    async init() {
        await this.sequelize.sync();
        await this.sequelize.authenticate()
        return this;
    }
}

module.exports = DataBase;