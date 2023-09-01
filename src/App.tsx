import MapContainer from '~/components/MapContainer';
import { VehicleSource } from '~/components/vehicle-source';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import { VehicleDetailWrapper } from './components/VehicleDetails';

export function App() {
  return (
    <>
      <Navbar />
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
