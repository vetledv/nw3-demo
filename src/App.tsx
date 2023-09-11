import MapContainer from '~/components/MapContainer';
import { VehicleSource } from '~/components/vehicle-source';
import Sidebar from './components/layout/Sidebar';
import { VehicleDetailWrapper } from './components/VehicleDetails';
import { useEffect, useRef, useState } from 'react';

const WSS_URL = 'ws://localhost:3001';

//TODO: move
export function useServerSubscription() {
  //TODO: add an id header that is: webclient-(UUID) or something,
  //so that the server can make sure there's only one web sending positions at a time
  //probably not relevant at this current time
  const ws = useRef<WebSocket>();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const socket = new WebSocket(WSS_URL);
    socket.onopen = () => {
      console.log('connected');
      setConnected(true);
    };
    socket.onmessage = (event) => {
      console.log(event);
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
