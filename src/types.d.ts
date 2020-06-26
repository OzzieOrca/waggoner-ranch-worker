import { KVNamespace } from '@cloudflare/workers-types';

declare global {
  const myKVNamespace: KVNamespace;
  const HELIUM_VERIFICATION_KEY: string;
  const HASURA_GRAPHQL_ENDPOINT: string;
  const AUTH0_TOKEN_ENDPOINT: string;
  const AUTH0_CLIENT_ID: string;
  const AUTH0_CLIENT_SECRET: string;
  const AUTH0_AUDIENCE: string;
}
