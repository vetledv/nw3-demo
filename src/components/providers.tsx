import { ApolloClientProvider } from '~/graphql/apollo-client';
import { type PropsWithChildren } from 'react';

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <ApolloClientProvider>{children}</ApolloClientProvider>
    </>
  );
}
