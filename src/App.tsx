import { useSubscription } from "@apollo/client";
import { subVehicles } from "~/graphql/queries";

export function App() {
  const vehiclesSub = useSubscription(subVehicles);
  //TODO: filter duplicates, keep newest entry
  return (
    <main>
      <h2>Subscriptions</h2>
      <ul className="space-y-1">
        {vehiclesSub.data?.vehicles?.map((vehicle) => (
          <li key={vehicle?.vehicleId} className="p-1 bg-zinc-200">
            {/* <p>{vehicle?.vehicleId}</p>
            <time>{new Date(vehicle?.lastUpdated).toLocaleTimeString()}</time> */}
            <pre>{JSON.stringify(vehicle, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </main>
  );
}
