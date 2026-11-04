import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface NeuroHiveContextType {
  // Connection status
  isConnected: boolean;
  
  // GPU Data
  gpus: any[];
  
  // Cognitive Architecture
  cognitive: {
    currentStep: number;
    isRunning: boolean;
  } | null;
  
  // Neuronal Ensembles
  ensembles: any[];
  
  // DNRT
  dnrt: any[];
  
  // System Info
  systemInfo: any;
  
  // Actions
  refreshData: () => void;
}

const NeuroHiveContext = createContext<NeuroHiveContextType | undefined>(undefined);

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function NeuroHiveProvider({ children }: { children: ReactNode }) {
  const [gpus, setGpus] = useState<any[]>([]);
  const [cognitive, setCognitive] = useState<any>(null);
  const [ensembles, setEnsembles] = useState<any[]>([]);
  const [dnrt, setDnrt] = useState<any[]>([]);
  const [systemInfo, setSystemInfo] = useState<any>(null);

  // WebSocket connection
  const { isConnected, sendMessage } = useWebSocket({
    url: WS_URL,
    onMessage: (data) => {
      if (data.gpus) setGpus(data.gpus);
      if (data.cognitive) setCognitive(data.cognitive);
      if (data.ensembles) setEnsembles(data.ensembles.ensembles || []);
      if (data.dnrt) setDnrt(data.dnrt.neurons || []);
    },
    onOpen: () => {
      console.log('🧠 NeuroHive WebSocket connecté');
    },
    onClose: () => {
      console.log('🔌 NeuroHive WebSocket déconnecté');
    },
  });

  // Fetch initial data
  const refreshData = async () => {
    try {
      const [gpuRes, cogRes, ensRes, dnrtRes, sysRes] = await Promise.all([
        fetch(`${API_URL}/api/gpu`),
        fetch(`${API_URL}/api/cognitive`),
        fetch(`${API_URL}/api/ensembles`),
        fetch(`${API_URL}/api/dnrt`),
        fetch(`${API_URL}/api/system`),
      ]);

      const [gpuData, cogData, ensData, dnrtData, sysData] = await Promise.all([
        gpuRes.json(),
        cogRes.json(),
        ensRes.json(),
        dnrtRes.json(),
        sysRes.json(),
      ]);

      setGpus(gpuData.gpus || []);
      setCognitive(cogData);
      setEnsembles(ensData.ensembles || []);
      setDnrt(dnrtData.neurons || []);
      setSystemInfo(sysData);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const value: NeuroHiveContextType = {
    isConnected,
    gpus,
    cognitive,
    ensembles,
    dnrt,
    systemInfo,
    refreshData,
  };

  return (
    <NeuroHiveContext.Provider value={value}>
      {children}
    </NeuroHiveContext.Provider>
  );
}

export function useNeuroHive() {
  const context = useContext(NeuroHiveContext);
  if (context === undefined) {
    throw new Error('useNeuroHive must be used within a NeuroHiveProvider');
  }
  return context;
}
