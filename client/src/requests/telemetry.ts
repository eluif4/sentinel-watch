import { BACKEND_API_URL } from "../constants/server"

export async function simulateSuccessTelemetry() {
    const body: object = {
        "path": getRandomAPIPath(),
        "method": getRandomMethod(),
        "ip": generateRandomIPv4(),
        "statusCode": getSuccessStatusCode(),
        "responseTimeMs": getSuccessResponseTime(),
    };

    const response = await fetch(
        `${BACKEND_API_URL}/telemetry/create`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

    return response;
}

export async function simulateErrorTelemetry() {
    const body: object = {
        "path": getRandomAPIPath(),
        "method": getRandomMethod(),
        "ip": generateRandomIPv4(),
        "statusCode": getAlertStatusCode(),
        "responseTimeMs": getAlertResponseTime(),
    };

    const response = await fetch(
        `${BACKEND_API_URL}/telemetry/create`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

    return response;
}

// statusCode >= 400 || responseTimeMs > 2000

function generateRandomIPv4() {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
}

function getRandomAPIPath() {
    const basePath = "/api/v1/";
    const endpoints = ["create", "delete", "generate", "update"];
    const randomN = Math.floor(Math.random() * endpoints.length);
    return basePath + endpoints[randomN];
}

// Helper functions
function getRandomMethod() {
    const methods = ["GET", "PUT", "PATCH", "POST", "DELETE"];
    const randomN = Math.floor(Math.random() * methods.length);
    return methods[randomN];
}

function getSuccessStatusCode() {
    const MIN = 200;
    const MAX = 399;
    return Math.floor(Math.random() * (MAX - MIN + 1) + MIN);
}

function getAlertStatusCode() {
    const MIN = 400;
    const MAX = 599;
    return Math.floor(Math.random() * (MAX - MIN + 1) + MIN);
}

function getSuccessResponseTime() {
    const MIN = 1;
    const MAX = 2000;
    return Math.floor(Math.random() * (MAX - MIN + 1) + MIN);
}

function getAlertResponseTime() {
    const MIN = 2001;
    const MAX = 10000;
    return Math.floor(Math.random() * (MAX - MIN + 1) + MIN);
}