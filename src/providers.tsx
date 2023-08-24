import {
  HttpLink,
  split,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const wss = "wss://api.entur.io/realtime/v1/vehicles/subscriptions";
const uri = "https://api.entur.io/realtime/v1/vehicles/graphql";

const httpLink = new HttpLink({ uri });

const wsLink = new GraphQLWsLink(
  createClient({
    url: wss,
    keepAlive: 10_000,
  })
);

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

const apolloClient = new ApolloClient({
  link: splitLink,
  ssrMode: typeof window === undefined,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </>
  );
}
