"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_1 = require("redis");
const socket_io_redis_1 = require("socket.io-redis");
const redisHost = process.env.REDIS_HOSTNAME || 'films_redis';
const redisPort = parseInt(process.env.REDIS_PORT || '6379');
const redisDb = parseInt(process.env.REDIS_DBINDEX || '0');
const redisPassword = process.env.REDIS_PASSWORD || undefined;
const redisSocket = process.env.REDIS_SOCKET || undefined;
const pubClient = new redis_1.RedisClient({
    host: redisHost,
    port: redisPort,
    db: redisDb,
    password: redisPassword,
    path: redisSocket,
});
const subClient = pubClient.duplicate();
const redisAdapter = (0, socket_io_redis_1.createAdapter)({ pubClient, subClient });
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io.adapter.middleware.js.map