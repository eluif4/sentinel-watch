export function isAlert(statusCode: number, responseTimeMs: number): boolean {
    return statusCode >= 400 || responseTimeMs > 2000;
}