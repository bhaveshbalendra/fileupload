"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTail = void 0;
const node_1 = require("@logtail/node");
const env_config_1 = require("./env.config");
exports.logTail = new node_1.Logtail(env_config_1.Env.LOGTAIL_SOURCE_TOKEN, {
    endpoint: env_config_1.Env.LOGTAIL_INGESTING_HOST,
});
