import { useState, useCallback, useRef, useEffect } from "react";

export const UseHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequest = useRef([]);

    const sendRequest = useCallback(
        async (url, method = "Get", body = null, headers = {}) => {
            setIsLoading(true);
            const httpAbortCtrll = new AbortController();
            activeHttpRequest.current.push(httpAbortCtrll);

            try {
                const response = await fetch(url, {
                    method: method,
                    body: body,
                    headers: headers,
                    signal: httpAbortCtrll.signal,
                });

                activeHttpRequest.current = activeHttpRequest.current.filter(
                    (reqCtrl) => reqCtrl !== httpAbortCtrll
                );

                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message);
                }
                setIsLoading(false);

                return responseData;
            } catch (err) {
                setError(err.message);
                setIsLoading(false)
                throw err;
            }
        },
        []
    );

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        return () => {
            activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
        };
    }, []);

    return { isLoading, error, sendRequest, clearError };
};
