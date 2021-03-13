import * as ShopifyErrors from './error';
export declare const Shopify: {
    Context: import("./context").ContextInterface;
    Auth: {
        SESSION_COOKIE_NAME: string;
        beginAuth(request: any, response: any, shop: string, redirectPath: string, isOnline?: boolean): Promise<string>;
        validateAuthCallback(request: any, response: any, query: import("./types").AuthQuery): Promise<void>;
        getCookieSessionId(request: any, response: any): string | undefined;
        getJwtSessionId(shop: string, userId: string): string;
        getOfflineSessionId(shop: string): string;
        getCurrentSessionId(request: any, response: any, isOnline?: boolean): string | undefined;
    };
    Session: {
        Session: typeof import("./auth/session/session").Session;
        MemorySessionStorage: typeof import("./auth/session").MemorySessionStorage;
        CustomSessionStorage: typeof import("./auth/session").CustomSessionStorage;
    };
    Clients: {
        Rest: typeof import("./clients/rest/rest_client").RestClient;
        Graphql: typeof import("./clients/graphql").GraphqlClient;
    };
    Utils: {
        decodeSessionToken: typeof import("./utils/decode-session-token").default;
        deleteCurrentSession: typeof import("./utils/delete-current-session").default;
        deleteOfflineSession: typeof import("./utils/delete-offline-session").default;
        loadCurrentSession: typeof import("./utils/load-current-session").default;
        loadOfflineSession: typeof import("./utils/load-offline-session").default;
        nonce: typeof import("./utils/nonce").default;
        graphqlProxy: typeof import("./utils/graphql_proxy").default;
        safeCompare: typeof import("./utils/safe-compare").default;
        storeSession: typeof import("./utils/store-session").default;
        validateHmac: typeof import("./utils/hmac-validator").default;
        validateShop: typeof import("./utils/shop-validator").default;
        withSession: typeof import("./utils/with-session").default;
    };
    Webhooks: {
        Registry: import("./webhooks/registry").RegistryInterface;
    };
    Errors: typeof ShopifyErrors;
};
export default Shopify;
export * from './types';
//# sourceMappingURL=index.d.ts.map