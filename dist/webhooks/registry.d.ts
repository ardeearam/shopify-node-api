/// <reference types="node" />
import http from 'http';
import { RegisterOptions, RegisterReturn, WebhookRegistryEntry } from './types';
interface RegistryInterface {
    webhookRegistry: WebhookRegistryEntry[];
    /**
     * Registers a Webhook Handler function for a given topic.
     *
     * @param options Parameters to register a handler, including topic, listening address, handler function
     */
    register(options: RegisterOptions): Promise<RegisterReturn>;
    /**
     * Processes the webhook request received from the Shopify API
     *
     * @param request HTTP request received from Shopify
     * @param response HTTP response to the request
     */
    process(request: http.IncomingMessage, response: http.ServerResponse): Promise<void>;
    /**
     * Confirms that the given path is a webhook path
     *
     * @param string path component of a URI
     */
    isWebhookPath(path: string): boolean;
}
declare const WebhooksRegistry: RegistryInterface;
export { WebhooksRegistry, RegistryInterface };
//# sourceMappingURL=registry.d.ts.map