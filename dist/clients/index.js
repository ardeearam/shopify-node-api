"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rest_1 = require("./rest");
var graphql_1 = require("./graphql");
var ShopifyClients = {
    Rest: rest_1.RestClient,
    Graphql: graphql_1.GraphqlClient,
};
exports.ShopifyClients = ShopifyClients;
exports.default = ShopifyClients;
