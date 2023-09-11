import MapContainer from '~/components/MapContainer';
import { VehicleSource } from '~/components/vehicle-source';
import Sidebar from './components/layout/Sidebar';
import { VehicleDetailWrapper } from './components/VehicleDetails';
import { useEffect, useRef } from 'react';

function useServerSubscription() {
  const ws = useRef<WebSocket>();
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');
    socket.onopen = () => {
      console.log('connected');
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
    };
  }, []);
  return ws;
}

export function App() {
  const ws = useServerSubscription();
  return (
    <>
      <Sidebar>
        <>
          <button
            onClick={() => {
              if (!ws) return;
              ws.current?.send('SLIRGSIURHØWSOUERHFgIUG');
            }}
            className='p-2 rounded-md bg-pink-400'>
            123
          </button>
          <VehicleDetailWrapper />
        </>
      </Sidebar>
      <main>
        <MapContainer>
          <VehicleSource />
        </MapContainer>
      </main>
    </>
  );
}
