import { useSubscription } from "@apollo/client";
import { subVehicles } from "~/graphql/queries";
import MapContainer from "./components/MapContainer";

export function App() {
  const vehiclesSub = useSubscription(subVehicles);
  //TODO: filter duplicates, keep newest entry
  return (
    <main>
      <MapContainer />
    </main>
  );
}
