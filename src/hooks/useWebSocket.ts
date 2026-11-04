import { useEffect, useState, useRef, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectInterval = 5000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<number>();

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('✅ WebSocket connecté:', url);
        setIsConnected(true);
        reconnectCountRef.current = 0;
        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message.data);
        } catch (error) {
          console.error('❌ Erreur parsing WebSocket:', error);
        }
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket déconnecté');
        setIsConnected(false);
        onClose?.();

        // Reconnexion automatique
        if (reconnectCountRef.current < maxReconnectAttempts) {
          reconnectCountRef.current++;
          console.log(`🔄 Tentative de reconnexion ${reconnectCountRef.current}/${maxReconnectAttempts}...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          console.error('❌ Nombre maximum de tentatives de reconnexion atteint');
        }
      };

      ws.onerror = (error) => {
        console.error('❌ Erreur WebSocket:', error);
        onError?.(error);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('❌ Erreur de connexion WebSocket:', error);
    }
  }, [url, onMessage, onOpen, onClose, onError, reconnectInterval, maxReconnectAttempts]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket non connecté, message non envoyé');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    reconnectCountRef.current = maxReconnectAttempts; // Empêcher la reconnexion
  }, [maxReconnectAttempts]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect: connect,
  };
}
