import MapContainer from "~/components/MapContainer";
import { VehicleSource } from "~/components/vehicle-source";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import VehicleDetails from "./components/VehicleDetails";

export function App() {
  return (
    <>
      <Navbar />
      <Sidebar>
        <VehicleDetails />
      </Sidebar>
      <main>
        <MapContainer>
          <VehicleSource />
        </MapContainer>
      </main>
    </>
  );
}
