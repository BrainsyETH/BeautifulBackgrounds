import type { DuneQueryConfig } from '@/types';

/**
 * Configure your Dune Analytics queries here.
 *
 * To add a query:
 * 1. Go to https://dune.com/brainsy/brave-web3
 * 2. Find the query ID from the chart URL (e.g., dune.com/queries/123456)
 * 3. Add an entry below with the query ID and display settings
 *
 * The site will fetch data from the Dune API and render custom charts.
 * Set DUNE_API_KEY in your environment variables.
 */
export const duneQueries: DuneQueryConfig[] = [
  // Example — replace with your actual query IDs:
  //
  // {
  //   id: 'bat-overview',
  //   title: 'BAT Token Overview',
  //   description: 'Key metrics for the Basic Attention Token',
  //   queryId: 123456,
  //   visualizationType: 'area',
  //   fullWidth: true,
  //   height: 400,
  // },
  // {
  //   id: 'brave-wallets',
  //   title: 'Brave Wallet Activity',
  //   description: 'Daily active Brave wallets on-chain',
  //   queryId: 789012,
  //   visualizationType: 'bar',
  //   fullWidth: false,
  //   height: 350,
  // },
];
