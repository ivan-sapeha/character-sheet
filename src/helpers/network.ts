type FetchWithProgressConfig = RequestInit & {
    responseType?: 'json' | 'text' | 'blob';
    onDownloadProgress?: (
        progressEvent: ProgressEvent & { progress: number },
    ) => void;
};

export async function fetchWithHandling<T>(
    url: string,
    config?: FetchWithProgressConfig,
): Promise<T> {
    try {
        const response = await fetch(url, {
            method: 'GET', // Default method for getting data
            ...config,
        });

        if (!response.ok) {
            // Handle HTTP errors
            throw new Error(
                `HTTP error! Status: ${response.status}, StatusText: ${response.statusText}`,
            );
        }

        if (config?.onDownloadProgress && response.body) {
            const reader = response.body.getReader();
            const contentLength = Number(
                response.headers.get('Content-Length'),
            );
            let receivedLength = 0;
            let lastUpdateTime = Date.now();

            const stream = new ReadableStream({
                async start(controller) {
                    async function read() {
                        const { done, value } = await reader.read();

                        if (done) {
                            controller.close();
                            return;
                        }

                        receivedLength += value?.length || 0;
                        const progress = contentLength
                            ? receivedLength / contentLength
                            : 0;
                        const now = Date.now();

                        if (
                            config!.onDownloadProgress! &&
                            now - lastUpdateTime >= 200
                        ) {
                            lastUpdateTime = now;
                            const progressEvent = Object.assign(
                                new ProgressEvent('progress', {
                                    lengthComputable: contentLength !== 0,
                                    loaded: receivedLength,
                                    total: contentLength,
                                }),
                                { progress },
                            );
                            config!.onDownloadProgress!(progressEvent);
                        }

                        controller.enqueue(value);
                        setTimeout(read, 200); // Introduce a small delay to pace the reads
                    }

                    read();
                },
            });

            const newResponse = new Response(stream, {
                headers: response.headers,
            });

            return await handleResponseType<T>(
                newResponse,
                config?.responseType,
            );
        } else {
            return await handleResponseType<T>(response, config?.responseType);
        }
    } catch (error) {
        // Handle network errors
        console.error('There was an error making the request:', error);
        throw error; // Re-throw so the calling function can handle it
    }
}

async function handleResponseType<T>(
    response: Response,
    responseType?: 'json' | 'text' | 'blob',
): Promise<T> {
    // Determine the response type
    switch (responseType) {
        case 'blob':
            return (await response.blob()) as unknown as T;
        case 'text':
            return (await response.text()) as unknown as T;
        case 'json':
        default:
            return (await response.json()) as T;
    }
}
