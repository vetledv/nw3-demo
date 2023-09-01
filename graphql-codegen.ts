import { CodegenConfig } from '@graphql-codegen/cli';

const config = {
  schema: 'src/graphql/schema.graphql',
  documents: [
    'src/**/*.tsx',
    'src/graphql/queries.ts',
    //TODO: figure out how to use these
    'src/graphql/queries/*.graphql',
  ],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/graphql/gen/': {
      preset: 'client',
    },
  },
} satisfies CodegenConfig;

export default config;
