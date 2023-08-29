import MapContainer from "~/components/MapContainer";
import { VehicleSource } from "~/components/vehicle-source";



export function App() {
  return (
    <main>
      <MapContainer>
        <VehicleSource />
      </MapContainer>
    </main>
  );
}
