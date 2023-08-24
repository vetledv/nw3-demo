import "./App.css";
import { gql, useSubscription } from "@apollo/client";

const subVehicles = gql`
  subscription {
    vehicles {
      lastUpdated
      vehicleId
      line {
        lineRef
      }
      location {
        latitude
        longitude
      }
    }
  }
`;

const vehicleQuery = gql`
  query Query {
    vehicles {
      vehicleId
    }
  }
`;

function App() {
  const asd = useSubscription(subVehicles);

  return (
    <>
      <pre>{JSON.stringify(asd.data, null, 2)}</pre>
    </>
  );
}

export default App;
