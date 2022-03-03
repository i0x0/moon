"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
class Server {
    constructor() {
        this.api = (0, fastify_1.default)();
        this.api
            .listen(3001, "0.0.0.0")
            .then(() => {
            console.log('api started...');
        })
            .catch((err) => {
            console.error(err);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map