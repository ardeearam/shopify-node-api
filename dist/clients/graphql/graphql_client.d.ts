import { RequestReturn } from '../http_client/types';
import { GraphqlParams } from './types';
export declare class GraphqlClient {
    readonly domain: string;
    readonly token?: string | undefined;
    private readonly client;
    constructor(domain: string, token?: string | undefined);
    query(params: GraphqlParams): Promise<RequestReturn>;
}
//# sourceMappingURL=graphql_client.d.ts.map