"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var querystring_1 = tslib_1.__importDefault(require("querystring"));
var cookies_1 = tslib_1.__importDefault(require("cookies"));
var context_1 = require("../../context");
var nonce_1 = tslib_1.__importDefault(require("../../utils/nonce"));
var hmac_validator_1 = tslib_1.__importDefault(require("../../utils/hmac-validator"));
var shop_validator_1 = tslib_1.__importDefault(require("../../utils/shop-validator"));
var safe_compare_1 = tslib_1.__importDefault(require("../../utils/safe-compare"));
var decode_session_token_1 = tslib_1.__importDefault(require("../../utils/decode-session-token"));
var session_1 = require("../session");
var http_client_1 = require("../../clients/http_client/http_client");
var types_1 = require("../../clients/http_client/types");
var ShopifyErrors = tslib_1.__importStar(require("../../error"));
var ShopifyOAuth = {
    SESSION_COOKIE_NAME: 'shopify_app_session',
    /**
     * Initializes a session and cookie for the OAuth process, and returns the necessary authorization url.
     *
     * @param request Current HTTP Request
     * @param response Current HTTP Response
     * @param shop Shop url: {shop}.myshopify.com
     * @param redirect Redirect url for callback
     * @param isOnline Boolean value. If true, appends 'per-user' grant options to authorization url to receive online access token.
     *                 During final oauth request, will receive back the online access token and current online session information.
     *                 Defaults to offline access.
     */
    beginAuth: function (request, response, shop, redirectPath, isOnline) {
        if (isOnline === void 0) { isOnline = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var state, session, sessionStored, query, queryString;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context_1.Context.throwIfUninitialized();
                        context_1.Context.throwIfPrivateApp('Cannot perform OAuth for private apps');
                        state = nonce_1.default();
                        console.error("1");
                        console.error(state);
                        session = new session_1.Session(isOnline ? state : this.getOfflineSessionId(shop));
                        session.shop = shop;
                        session.state = state;
                        session.isOnline = isOnline;
                        return [4 /*yield*/, context_1.Context.SESSION_STORAGE.storeSession(session)];
                    case 1:
                        sessionStored = _a.sent();
                        if (!sessionStored) {
                            throw new ShopifyErrors.SessionStorageError('OAuth Session could not be saved. Please check your session storage functionality.');
                        }
                        query = {
                            client_id: context_1.Context.API_KEY,
                            scope: context_1.Context.SCOPES.toString(),
                            redirect_uri: "https://" + context_1.Context.HOST_NAME + redirectPath,
                            state: state,
                            'grant_options[]': isOnline ? 'per-user' : '',
                        };
                        queryString = querystring_1.default.stringify(query);
                        return [2 /*return*/, "https://" + shop + "/admin/oauth/authorize?" + queryString];
                }
            });
        });
    },
    /**
     * Validates the received callback query.
     * If valid, will make the subsequent request to update the current session with the appropriate access token.
     * Throws errors for missing sessions and invalid callbacks.
     *
     * @param request Current HTTP Request
     * @param response Current HTTP Response
     * @param query Current HTTP Request Query, containing the information to be validated.
     *              Depending on framework, this may need to be cast as "unknown" before being passed.
     */
    validateAuthCallback: function (request, response, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cookies, currentSession, body, postParams, client, postResponse, responseBody, access_token, scope, rest, sessionExpiration, responseBody, oauthSessionExpiration, onlineInfo, jwtSessionId, jwtSession, sessionStored;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context_1.Context.throwIfUninitialized();
                        context_1.Context.throwIfPrivateApp('Cannot perform OAuth for private apps');
                        console.error(2);
                        console.error(query);
                        console.error(query.state);
                        cookies = new cookies_1.default(request, response, {
                            keys: [context_1.Context.API_SECRET_KEY],
                            secure: true,
                        });
                        return [4 /*yield*/, context_1.Context.SESSION_STORAGE.loadSession(query.state)];
                    case 1:
                        currentSession = _a.sent();
                        console.error('currentSession');
                        console.error(currentSession);
                        if (!currentSession) {
                            throw new ShopifyErrors.SessionNotFound("Cannot complete OAuth process. No session found for the specified shop url: " + query.shop);
                        }
                        if (!validQuery(query, currentSession)) {
                            throw new ShopifyErrors.InvalidOAuthError('Invalid OAuth callback.');
                        }
                        body = {
                            client_id: context_1.Context.API_KEY,
                            client_secret: context_1.Context.API_SECRET_KEY,
                            code: query.code,
                        };
                        postParams = {
                            path: '/admin/oauth/access_token',
                            type: types_1.DataType.JSON,
                            data: body,
                        };
                        client = new http_client_1.HttpClient(currentSession.shop);
                        return [4 /*yield*/, client.post(postParams)];
                    case 2:
                        postResponse = _a.sent();
                        if (currentSession.isOnline) {
                            responseBody = postResponse.body;
                            access_token = responseBody.access_token, scope = responseBody.scope, rest = tslib_1.__rest(responseBody, ["access_token", "scope"]);
                            sessionExpiration = new Date(Date.now() + responseBody.expires_in * 1000);
                            currentSession.accessToken = access_token;
                            currentSession.expires = sessionExpiration;
                            currentSession.scope = scope;
                            currentSession.onlineAccessInfo = rest;
                        }
                        else {
                            responseBody = postResponse.body;
                            currentSession.accessToken = responseBody.access_token;
                            currentSession.scope = responseBody.scope;
                        }
                        oauthSessionExpiration = currentSession.expires;
                        if (!!currentSession.isOnline) return [3 /*break*/, 3];
                        oauthSessionExpiration = new Date();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!context_1.Context.IS_EMBEDDED_APP) return [3 /*break*/, 5];
                        onlineInfo = currentSession.onlineAccessInfo;
                        jwtSessionId = this.getJwtSessionId(currentSession.shop, "" + onlineInfo.associated_user.id);
                        jwtSession = session_1.Session.cloneSession(currentSession, jwtSessionId);
                        return [4 /*yield*/, context_1.Context.SESSION_STORAGE.storeSession(jwtSession)];
                    case 4:
                        _a.sent();
                        // Make sure the current OAuth session expires along with the cookie
                        oauthSessionExpiration = new Date(Date.now() + 30000);
                        currentSession.expires = oauthSessionExpiration;
                        _a.label = 5;
                    case 5: return [4 /*yield*/, context_1.Context.SESSION_STORAGE.storeSession(currentSession)];
                    case 6:
                        sessionStored = _a.sent();
                        if (!sessionStored) {
                            throw new ShopifyErrors.SessionStorageError('OAuth Session could not be saved. Please check your session storage functionality.');
                        }
                        console.error(currentSession);
                        return [2 /*return*/, currentSession];
                }
            });
        });
    },
    /**
     * Loads the current session id from the session cookie.
     *
     * @param request HTTP request object
     * @param response HTTP response object
     */
    getCookieSessionId: function (request, response) {
        var cookies = new cookies_1.default(request, response, {
            secure: true,
            keys: [context_1.Context.API_SECRET_KEY],
        });
        return cookies.get(this.SESSION_COOKIE_NAME, { signed: true });
    },
    /**
     * Builds a JWT session id from the current shop and user.
     *
     * @param shop Shopify shop domain
     * @param userId Current actor id
     */
    getJwtSessionId: function (shop, userId) {
        return shop + "_" + userId;
    },
    /**
     * Builds an offline session id for the given shop.
     *
     * @param shop Shopify shop domain
     */
    getOfflineSessionId: function (shop) {
        return "offline_" + shop;
    },
    /**
     * Extracts the current session id from the request / response pair.
     *
     * @param request  HTTP request object
     * @param response HTTP response object
     * @param isOnline Whether to load online (default) or offline sessions (optional)
     */
    getCurrentSessionId: function (request, response, isOnline) {
        if (isOnline === void 0) { isOnline = true; }
        var currentSessionId;
        if (context_1.Context.IS_EMBEDDED_APP) {
            var authHeader = request.headers.authorization;
            if (authHeader) {
                var matches = authHeader.match(/^Bearer (.+)$/);
                if (!matches) {
                    throw new ShopifyErrors.MissingJwtTokenError('Missing Bearer token in authorization header');
                }
                var jwtPayload = decode_session_token_1.default(matches[1]);
                var shop = jwtPayload.dest.replace(/^https:\/\//, '');
                if (isOnline) {
                    currentSessionId = this.getJwtSessionId(shop, jwtPayload.sub);
                }
                else {
                    currentSessionId = this.getOfflineSessionId(shop);
                }
            }
        }
        // Non-embedded apps will always load sessions using cookies. However, we fall back to the cookie session for
        // embedded apps to allow apps to load their skeleton page after OAuth, so they can set up App Bridge and get a new
        // JWT.
        if (!currentSessionId) {
            // We still want to get the offline session id from the cookie to make sure it's validated
            currentSessionId = this.getCookieSessionId(request, response);
        }
        return currentSessionId;
    },
};
exports.ShopifyOAuth = ShopifyOAuth;
/**
 * Uses the validation utils validateHmac, validateShop, and safeCompare to assess whether the callback is valid.
 *
 * @param query Current HTTP Request Query
 * @param session Current session
 */
function validQuery(query, session) {
    return hmac_validator_1.default(query) && shop_validator_1.default(query.shop) && safe_compare_1.default(query.state, session.state);
}
