import MapContainer from '~/components/MapContainer';
import { VehicleSource } from '~/components/vehicle-source';
import Sidebar from './components/layout/Sidebar';
import { VehicleDetailWrapper } from './components/VehicleDetails';
import { useEffect, useRef, useState } from 'react';

//TODO: move
export function useServerSubscription() {
  const ws = useRef<WebSocket>();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');

    socket.onopen = () => {
      console.log('connected');
      setConnected(true);
    };
    socket.addEventListener('message', (data) => {
      console.log(data);
    });
    socket.onmessage = (data) => {
      console.log('onmessage', data);
    };
    ws.current = socket;
    return () => {
      socket.close();
      ws.current = undefined;
      setConnected(false);
    };
  }, []);
  return [ws, connected] as const;
}

export function App() {
  return (
    <>
      <Sidebar>
        <VehicleDetailWrapper />
      </Sidebar>
      <main>
        <MapContainer>
          <VehicleSource />
        </MapContainer>
      </main>
    </>
  );
}
