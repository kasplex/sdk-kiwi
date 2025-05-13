/**
 * A flexible HTTP request utility class supporting GET, POST, PUT, and DELETE methods.
 */
class HttpRequest {

    private defaultHeaders: HeadersInit;
    private timeout: number;

    /**
     * Constructs an instance of HttpRequest.
     * @param timeout Request timeout in milliseconds (default: 10s).
     * @param headers Optional default headers for all requests.
     */
    constructor(timeout = 5000, headers: HeadersInit = {}) {
        this.timeout = timeout;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...headers
        };
    }

    /**
     * Sends an HTTP request with the specified method and parameters.
     * @param method HTTP method (GET, POST, PUT, DELETE).
     * @param url Full API URL.
     * @param params Optional query parameters.
     * @param body Optional request body (for POST, PUT).
     * @param headers Optional headers to override defaults.
     * @returns A Promise resolving to the response data.
     */
    private async request<T>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        url: string,
        params: Record<string, string> = {},
        body?: any,
        headers: HeadersInit = {}
    ): Promise<T> {
        // Build URL with query parameters
        const requestUrl = new URL(url);
        console.log("url:", url)

        Object.entries(params).forEach(([key, value]) => requestUrl.searchParams.append(key, value));

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(requestUrl.toString(), {
                method,
                headers: { ...this.defaultHeaders, ...headers },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let text = await response.text();
                if (text) {
                    throw new Error(`HTTP Error with info: ${text}`);
                } else {
                    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
                }
            }

            return await response.json().catch(() => {
                throw new Error(`Failed to parse JSON response from: ${requestUrl.toString()}`);
            });
        } catch (error) {
            clearTimeout(timeoutId);
            throw new Error(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /** Performs a GET request. */
    public get<T>(url: string, params: Record<string, string> = {}, headers?: HeadersInit): Promise<T> {
        return this.request<T>('GET', url, params, undefined, headers);
    }

    /** Performs a POST request. */
    public post<T>(url: string, body: any, params: Record<string, string> = {}, headers?: HeadersInit): Promise<T> {
        return this.request<T>('POST', url, params, body, headers);
    }
}
let httpClient = new HttpRequest();

export { httpClient, HttpRequest }