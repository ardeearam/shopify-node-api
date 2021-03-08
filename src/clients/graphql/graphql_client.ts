import {MissingRequiredArgument} from '../../error';
import {Context} from '../../context';
import {ShopifyHeader} from '../../base_types';
import {HttpClient} from '../http_client/http_client';
import {ApiClientParams, DataType, RequestReturn} from '../http_client/types';
import * as ShopifyErrors from '../../error';

import {GraphqlParams} from './types';

export interface AccessTokenHeader {
  header: string;
  value: string;
}

export class GraphqlClient {
  readonly domain: string;
  readonly accessToken?: string;

  protected baseApiPath = '/admin/api';

  private readonly client: HttpClient;

  // When we next release a major version for this library, we should remove string as a valid type for params and
  // remove the accessToken param. Also remove the first block.
  public constructor(params: ApiClientParams | string, accessToken?: string) {
    if (typeof params === 'string') {
      // eslint-disable-next-line no-param-reassign
      params = {
        domain: params,
        accessToken,
      };
    }

    this.domain = params.domain;
    this.client = new HttpClient(this.domain);

    this.accessToken = params.accessToken;

    if (!Context.IS_PRIVATE_APP && !this.accessToken) {
      throw new ShopifyErrors.MissingRequiredArgument('Missing access token when creating GraphQL client');
    }
  }

  async query(params: GraphqlParams): Promise<RequestReturn> {
    if (params.data.length === 0) {
      throw new MissingRequiredArgument('Query missing.');
    }

    const accessTokenHeader = this.getAccessTokenHeader();
    params.extraHeaders = {
      [accessTokenHeader.header]: accessTokenHeader.value,
      ...params.extraHeaders,
    };

    const path = `${this.baseApiPath}/${Context.API_VERSION}/graphql.json`;

    let dataType: DataType.GraphQL | DataType.JSON;

    if (typeof params.data === 'object') {
      dataType = DataType.JSON;
    } else {
      dataType = DataType.GraphQL;
    }

    return this.client.post({path, type: dataType, ...params});
  }

  protected getAccessTokenHeader(): AccessTokenHeader {
    return {
      header: ShopifyHeader.AccessToken,
      value: Context.IS_PRIVATE_APP ? Context.API_SECRET_KEY : this.accessToken as string,
    };
  }
}
