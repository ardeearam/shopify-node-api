"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var querystring_1 = tslib_1.__importDefault(require("querystring"));
var context_1 = require("../../context");
var base_types_1 = require("../../base_types");
var http_client_1 = require("../http_client/http_client");
var ShopifyErrors = tslib_1.__importStar(require("../../error"));
var RestClient = /** @class */ (function (_super) {
    tslib_1.__extends(RestClient, _super);
    function RestClient(domain, accessToken) {
        var _this = _super.call(this, domain) || this;
        _this.accessToken = accessToken;
        if (!context_1.Context.IS_PRIVATE_APP && !accessToken) {
            throw new ShopifyErrors.MissingRequiredArgument('Missing access token when creating REST client');
        }
        return _this;
    }
    RestClient.prototype.request = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ret, link, pageInfo, links, links_1, links_1_1, link_1, parsedLink, linkRel, linkUrl, linkFields, linkPageToken;
            var e_1, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params.extraHeaders = tslib_1.__assign({}, params.extraHeaders);
                        params.extraHeaders[base_types_1.ShopifyHeader.AccessToken] = context_1.Context.IS_PRIVATE_APP
                            ? context_1.Context.API_SECRET_KEY : this.accessToken;
                        params.path = this.getRestPath(params.path);
                        return [4 /*yield*/, _super.prototype.request.call(this, params)];
                    case 1:
                        ret = (_b.sent());
                        link = ret.headers.get('link');
                        if (params.query && link !== undefined) {
                            pageInfo = {
                                limit: params.query.limit.toString(),
                            };
                            if (link) {
                                links = link.split(', ');
                                try {
                                    for (links_1 = tslib_1.__values(links), links_1_1 = links_1.next(); !links_1_1.done; links_1_1 = links_1.next()) {
                                        link_1 = links_1_1.value;
                                        parsedLink = link_1.match(RestClient.LINK_HEADER_REGEXP);
                                        if (!parsedLink) {
                                            continue;
                                        }
                                        linkRel = parsedLink[2];
                                        linkUrl = new URL(parsedLink[1]);
                                        linkFields = linkUrl.searchParams.get('fields');
                                        linkPageToken = linkUrl.searchParams.get('page_info');
                                        if (!pageInfo.fields && linkFields) {
                                            pageInfo.fields = linkFields.split(',');
                                        }
                                        if (linkPageToken) {
                                            switch (linkRel) {
                                                case 'previous':
                                                    pageInfo.previousPageUrl = parsedLink[1];
                                                    pageInfo.prevPage = this.buildRequestParams(parsedLink[1]);
                                                    break;
                                                case 'next':
                                                    pageInfo.nextPageUrl = parsedLink[1];
                                                    pageInfo.nextPage = this.buildRequestParams(parsedLink[1]);
                                                    break;
                                            }
                                        }
                                    }
                                }
                                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                finally {
                                    try {
                                        if (links_1_1 && !links_1_1.done && (_a = links_1.return)) _a.call(links_1);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                }
                            }
                            ret.pageInfo = pageInfo;
                        }
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    RestClient.prototype.getRestPath = function (path) {
        return "/admin/api/" + context_1.Context.API_VERSION + "/" + path + ".json";
    };
    RestClient.prototype.buildRequestParams = function (newPageUrl) {
        var url = new URL(newPageUrl);
        var path = url.pathname.replace(/^\/admin\/api\/[^/]+\/(.*)\.json$/, '$1');
        var query = querystring_1.default.decode(url.search.replace(/^\?(.*)/, '$1'));
        return {
            path: path,
            query: query,
        };
    };
    RestClient.LINK_HEADER_REGEXP = /<([^<]+)>; rel="([^"]+)"/;
    return RestClient;
}(http_client_1.HttpClient));
exports.RestClient = RestClient;
