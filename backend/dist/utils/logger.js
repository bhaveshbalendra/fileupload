"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("@logtail/winston");
const winston_2 = __importDefault(require("winston"));
const env_config_1 = require("../config/env.config");
const longtail_config_1 = require("../config/longtail.config");
const { combine, colorize, timestamp, errors, json, printf } = winston_2.default.format;
const transports = [];
if (env_config_1.Env.NODE_ENV === "production") {
    transports.push(new winston_1.LogtailTransport(longtail_config_1.logTail));
}
if (env_config_1.Env.NODE_ENV === "development") {
    transports.push(new winston_2.default.transports.Console({
        format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss A" }), errors({ stack: true }), printf((_a) => {
            var { level, message, stack, timestamp } = _a, meta = __rest(_a, ["level", "message", "stack", "timestamp"]);
            return `${timestamp} ${level}: ${message} ${stack ? stack : ""} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
        }), colorize({
            all: true,
            colors: {
                info: "blue",
                warn: "yellow",
                error: "red",
                debug: "cyan",
                verbose: "grey",
                http: "green",
            },
        })),
    }));
}
const logger = winston_2.default.createLogger({
    level: env_config_1.Env.LOG_LEVEL,
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports: transports,
    silent: env_config_1.Env.NODE_ENV === "test",
});
exports.default = logger;
