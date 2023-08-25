import { ApolloClientProvider } from "~/graphql/apollo-client";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <>
      <ApolloClientProvider>{children}</ApolloClientProvider>
    </>
  );
}
