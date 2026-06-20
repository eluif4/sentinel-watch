import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './websocket/websocket.config'
import { simulateErrorTelemetry, simulateSuccessTelemetry } from './requests/telemetry'

type RequestStatus =
    | { state: 'idle' }
    | { state: 'loading' }
    | { state: 'success'; statusCode: number; message: string }
    | { state: 'error'; message: string }

async function runTelemetryRequest(
    request: () => Promise<Response>,
    setRequestStatus: (status: RequestStatus) => void,
) {
    setRequestStatus({ state: 'loading' })

    try {
        const response = await request()
        const data: { message?: string } | null = await response.json().catch(() => null)

        if (!response.ok) {
            setRequestStatus({
                state: 'error',
                message: data?.message ?? `Request failed (${response.status})`,
            })
            return
        }

        setRequestStatus({
            state: 'success',
            statusCode: response.status,
            message: data?.message ?? 'Request sent',
        })
    } catch (error) {
        setRequestStatus({
            state: 'error',
            message: error instanceof Error ? error.message : 'Network error',
        })
    }
}

function App() {
    const [securityAlertData, setSecurityAlertData] = useState<unknown>()
    const [isConnected, setIsConnected] = useState(socket.connected)
    const [requestStatus, setRequestStatus] = useState<RequestStatus>({ state: 'idle' })

    useEffect(() => {
        function onConnect() {
            setIsConnected(true)
        }

        function onDisconnect() {
            setIsConnected(false)
        }

        function onSecurityAlert(data: unknown) {
            console.log('Security alert received')
            setSecurityAlertData(data)
        }

        socket.on('connect', onConnect)
        socket.on('disconnect', onDisconnect)
        socket.on('security_alert', onSecurityAlert)

        return () => {
            socket.off('connect', onConnect)
            socket.off('disconnect', onDisconnect)
            socket.off('security_alert', onSecurityAlert)
        }
    }, [])

    const isLoading = requestStatus.state === 'loading'

    return (
        <main className="audit-app">
            <header className="audit-header">
                <h1>Telemetry Audit</h1>
                <p className="connection-status">
                    WebSocket: <span data-connected={isConnected}>{isConnected ? 'connected' : 'disconnected'}</span>
                </p>
            </header>

            <div className="audit-actions">
                <button
                    type="button"
                    className="audit-btn audit-btn--green"
                    disabled={isLoading}
                    onClick={() => runTelemetryRequest(simulateSuccessTelemetry, setRequestStatus)}
                >
                    Simulate Successful Request
                </button>
                <button
                    type="button"
                    className="audit-btn audit-btn--red"
                    disabled={isLoading}
                    onClick={() => runTelemetryRequest(simulateErrorTelemetry, setRequestStatus)}
                >
                    Simulate Alert Request
                </button>
            </div>

            <p className="request-status" data-state={requestStatus.state}>
                {requestStatus.state === 'idle' && 'No request sent yet.'}
                {requestStatus.state === 'loading' && 'Sending request...'}
                {requestStatus.state === 'success' &&
                    `Success (${requestStatus.statusCode}): ${requestStatus.message}`}
                {requestStatus.state === 'error' && `Error: ${requestStatus.message}`}
            </p>

            <section className="audit-display">
                <h2>Security Alert Data</h2>
                <pre className="audit-json">
                    {securityAlertData != null
                        ? JSON.stringify(securityAlertData, null, 2)
                        : 'Waiting for security alert...'}
                </pre>
            </section>
        </main>
    )
}

export default App
