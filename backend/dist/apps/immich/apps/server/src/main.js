"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const app_module_1 = require("./app.module");
const redis_io_adapter_middleware_1 = require("./middlewares/redis-io.adapter.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.set('trust proxy');
    app.use((0, cookie_parser_1.default)());
    if (process.env.NODE_ENV === 'development') {
        app.enableCors();
    }
    app.useWebSocketAdapter(new redis_io_adapter_middleware_1.RedisIoAdapter(app));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('MyFilmsList')
        .setDescription('MyFilmsList API')
        .setVersion('1.17.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    })
        .addServer('/api')
        .build();
    const apiDocumentOptions = {
        operationIdFactory: (controllerKey, methodKey) => methodKey,
    };
    const apiDocument = swagger_1.SwaggerModule.createDocument(app, config, apiDocumentOptions);
    swagger_1.SwaggerModule.setup('doc', app, apiDocument, {
        swaggerOptions: {
            persistAuthorization: true,
        },
        customSiteTitle: 'MyFilmsList API Documentation',
    });
    await app.listen(3001, () => {
        if (process.env.NODE_ENV == 'development') {
            const outputPath = path_1.default.resolve(process.cwd(), 'myfilms-openapi-specs.json');
            (0, fs_1.writeFileSync)(outputPath, JSON.stringify(apiDocument), { encoding: 'utf8' });
        }
        common_1.Logger.log(`Running MyFilmsList Server in ${process.env.NODE_ENV || "development"} environment`, 'FilmsServer');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map