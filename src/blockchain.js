const Web3 = require("web3");
const Web3Extend = require("web3-skrumble-extend");

function initWeb3(config) {
    var provider;
    switch (config.providerType) {
        case "http":
            provider = new Web3.providers.HttpProvider(config.providerPath)
            break;
        case "websocket":
            provider = new Web3.providers.WebsocketProvider(config.providerPath)
            break;
        case "ipc":
            provider = new Web3.providers.IpcProvider(config.providerPath, require('net'))
            break;
        default:
            provider = config.providerPath;
            break;
    }
    var web3 = new Web3(provider)
    Web3Extend.extend(web3);
    return web3;
}


class BlockChain {
    constructor(options) {
        this.web3 = initWeb3(options);
    }

    getUserInfo(address) {
        return this.web3.skm.getUser(address);
    }

    recover(message, signature) {
        return this.web3.eth.accounts.recover(message, signature);
    }

    async init() {
        return this;
    }
}

module.exports = BlockChain;