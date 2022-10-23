"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_config_1 = require("./config/app.config");
const bull_1 = require("@nestjs/bull");
const app_controller_1 = require("./app.controller");
const schedule_1 = require("@nestjs/schedule");
const database_1 = require("../../../libs/database/src");
let AppModule = class AppModule {
    configure(consumer) {
        if (process.env.NODE_ENV == 'development') {
        }
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(app_config_1.immichAppConfig),
            database_1.DatabaseModule,
            bull_1.BullModule.forRootAsync({
                useFactory: async () => ({
                    prefix: 'films_bull',
                    redis: {
                        host: process.env.REDIS_HOSTNAME || 'films_redis',
                        port: parseInt(process.env.REDIS_PORT || '6379'),
                        db: parseInt(process.env.REDIS_DBINDEX || '0'),
                        password: process.env.REDIS_PASSWORD || undefined,
                        path: process.env.REDIS_SOCKET || undefined,
                    },
                }),
            }),
            schedule_1.ScheduleModule.forRoot()
        ],
        controllers: [app_controller_1.AppController],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map