"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var session_1 = require("./session");
exports.Session = session_1.Session;
var memory_1 = require("./storage/memory");
exports.MemorySessionStorage = memory_1.MemorySessionStorage;
var custom_1 = require("./storage/custom");
exports.CustomSessionStorage = custom_1.CustomSessionStorage;
var ShopifySession = {
    Session: session_1.Session,
    MemorySessionStorage: memory_1.MemorySessionStorage,
    CustomSessionStorage: custom_1.CustomSessionStorage,
};
exports.default = ShopifySession;
