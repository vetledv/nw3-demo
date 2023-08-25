import {
  HttpLink,
  split,
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";

const wss = "wss://api.entur.io/realtime/v1/vehicles/subscriptions";
const uri = "https://api.entur.io/realtime/v1/vehicles/graphql";

/**
 * Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header
 * @link https://developer.entur.org/pages-intro-authentication
 */
const headers = {
  "ET-Client-Name": "bouvet-nw3demo",
} as const;

const httpLink = new HttpLink({ uri });

const wsLink = new WebSocketLink(
  new SubscriptionClient(wss, {
    reconnect: true,
    connectionParams: headers,
  })
);

/**
 * @link https://www.apollographql.com/docs/react/data/subscriptions#3-split-communication-by-operation-recommended
 */
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return (
      def.kind === "OperationDefinition" && def.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

/**
 * wsLink requires to be init on the client, this is done in case hydration is utilized in the future
 * @returns `httpLink` if ssr, `splitLink` otherwise
 */
function chooseLink() {
  if (typeof window !== "undefined") {
    return splitLink;
  }
  return httpLink;
}

const apolloClient = new ApolloClient({
  link: chooseLink(),
  cache: new InMemoryCache(),
  headers,
  connectToDevTools: true,
});

export function ApolloClientProvider({ children }: React.PropsWithChildren) {
  if (process.env.NODE_ENV === "development") {
    loadDevMessages();
    loadErrorMessages();
  }
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
