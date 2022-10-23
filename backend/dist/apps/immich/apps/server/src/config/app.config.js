"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.immichAppConfig = void 0;
const joi_1 = __importDefault(require("joi"));
exports.immichAppConfig = {
    envFilePath: '.env',
    isGlobal: true,
    validationSchema: joi_1.default.object({
        NODE_ENV: joi_1.default.string().required().valid('development', 'production', 'staging').default('development'),
        MONGO_URI: joi_1.default.string().required()
    }),
};
//# sourceMappingURL=app.config.js.map