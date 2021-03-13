"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Stores App information from logged in merchants so they can make authenticated requests to the Admin API.
 */
var Session = /** @class */ (function () {
    function Session(id) {
        this.id = id;
    }
    Session.cloneSession = function (session, newId) {
        var newSession = new Session(newId);
        newSession.shop = session.shop;
        newSession.state = session.state;
        newSession.scope = session.scope;
        newSession.expires = session.expires;
        newSession.isOnline = session.isOnline;
        newSession.accessToken = session.accessToken;
        newSession.onlineAccessInfo = session.onlineAccessInfo;
        return newSession;
    };
    return Session;
}());
exports.Session = Session;
