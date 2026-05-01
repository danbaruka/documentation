import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/search',
    component: ComponentCreator('/search', '822'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '0cb'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'baa'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '65a'),
            routes: [
              {
                path: '/cli/bank',
                component: ComponentCreator('/cli/bank', '2ce'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/governance',
                component: ComponentCreator('/cli/governance', '231'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/keys',
                component: ComponentCreator('/cli/keys', '3e0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/overview',
                component: ComponentCreator('/cli/overview', '9bd'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/query',
                component: ComponentCreator('/cli/query', '893'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/staking',
                component: ComponentCreator('/cli/staking', 'c34'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/tx',
                component: ComponentCreator('/cli/tx', '55e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/developers/cosmjs',
                component: ComponentCreator('/developers/cosmjs', '07e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/developers/ibc-transfer',
                component: ComponentCreator('/developers/ibc-transfer', 'a5d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/developers/quickstart',
                component: ComponentCreator('/developers/quickstart', 'a49'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/getting-started/quick-links',
                component: ComponentCreator('/getting-started/quick-links', '609'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/getting-started/what-is-safrochain',
                component: ComponentCreator('/getting-started/what-is-safrochain', 'a01'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/ibc/channels',
                component: ComponentCreator('/ibc/channels', '4db'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/ibc/hermes-setup',
                component: ComponentCreator('/ibc/hermes-setup', '02e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/ibc/overview',
                component: ComponentCreator('/ibc/overview', '944'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/intro',
                component: ComponentCreator('/intro', 'c3b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/auth',
                component: ComponentCreator('/modules/auth', '7e7'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/authz',
                component: ComponentCreator('/modules/authz', '488'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/bank',
                component: ComponentCreator('/modules/bank', '656'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/clock',
                component: ComponentCreator('/modules/clock', 'de9'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/consensus',
                component: ComponentCreator('/modules/consensus', '95f'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/crisis',
                component: ComponentCreator('/modules/crisis', '2fa'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/cw-hooks',
                component: ComponentCreator('/modules/cw-hooks', '7d6'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/distribution',
                component: ComponentCreator('/modules/distribution', 'a17'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/drip',
                component: ComponentCreator('/modules/drip', '07a'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/evidence',
                component: ComponentCreator('/modules/evidence', '695'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/feegrant',
                component: ComponentCreator('/modules/feegrant', 'c39'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/feepay',
                component: ComponentCreator('/modules/feepay', '0be'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/feeshare',
                component: ComponentCreator('/modules/feeshare', '767'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/globalfee',
                component: ComponentCreator('/modules/globalfee', 'bcf'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/gov',
                component: ComponentCreator('/modules/gov', 'c0e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/ibc-core',
                component: ComponentCreator('/modules/ibc-core', 'e8c'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/ibc-fee',
                component: ComponentCreator('/modules/ibc-fee', '8f1'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/ibc-hooks',
                component: ComponentCreator('/modules/ibc-hooks', 'bfc'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/ibc-transfer-app',
                component: ComponentCreator('/modules/ibc-transfer-app', '75d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/interchain-accounts',
                component: ComponentCreator('/modules/interchain-accounts', 'd2c'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/interchain-query',
                component: ComponentCreator('/modules/interchain-query', '3eb'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/mint',
                component: ComponentCreator('/modules/mint', 'df9'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/nft',
                component: ComponentCreator('/modules/nft', '6a9'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/overview',
                component: ComponentCreator('/modules/overview', 'b6b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/params',
                component: ComponentCreator('/modules/params', 'b13'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/slashing',
                component: ComponentCreator('/modules/slashing', '4b5'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/staking',
                component: ComponentCreator('/modules/staking', 'ec7'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/tokenfactory',
                component: ComponentCreator('/modules/tokenfactory', '3a7'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/upgrade',
                component: ComponentCreator('/modules/upgrade', '095'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/vesting',
                component: ComponentCreator('/modules/vesting', '2b8'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/wasm',
                component: ComponentCreator('/modules/wasm', '7e9'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/chain-registry',
                component: ComponentCreator('/networks/chain-registry', 'de1'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/mainnet-endpoints',
                component: ComponentCreator('/networks/mainnet-endpoints', '729'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/testnet-endpoints',
                component: ComponentCreator('/networks/testnet-endpoints', '6a3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/protocol/foundation',
                component: ComponentCreator('/protocol/foundation', '14e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/protocol/governance',
                component: ComponentCreator('/protocol/governance', 'cc5'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/protocol/tokenomics',
                component: ComponentCreator('/protocol/tokenomics', '980'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/resources/brand-assets',
                component: ComponentCreator('/resources/brand-assets', 'bec'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/resources/faq',
                component: ComponentCreator('/resources/faq', '1df'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/resources/whitepaper',
                component: ComponentCreator('/resources/whitepaper', 'a2d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/hardware',
                component: ComponentCreator('/run-a-node/hardware', '4a3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/install',
                component: ComponentCreator('/run-a-node/install', '2da'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/join-mainnet',
                component: ComponentCreator('/run-a-node/join-mainnet', '6aa'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/join-testnet',
                component: ComponentCreator('/run-a-node/join-testnet', 'da0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/local-testnet',
                component: ComponentCreator('/run-a-node/local-testnet', 'af0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/overview',
                component: ComponentCreator('/run-a-node/overview', 'b7e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/snapshots',
                component: ComponentCreator('/run-a-node/snapshots', '9c8'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/statesync',
                component: ComponentCreator('/run-a-node/statesync', 'bc2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/upgrades',
                component: ComponentCreator('/run-a-node/upgrades', '17c'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/alerting',
                component: ComponentCreator('/validators/alerting', 'a98'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/become-a-validator',
                component: ComponentCreator('/validators/become-a-validator', 'a44'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/disaster-recovery',
                component: ComponentCreator('/validators/disaster-recovery', 'eb8'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/key-management',
                component: ComponentCreator('/validators/key-management', 'c09'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/monitoring',
                component: ComponentCreator('/validators/monitoring', 'ce2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/operations',
                component: ComponentCreator('/validators/operations', '2d9'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/overview',
                component: ComponentCreator('/validators/overview', 'a2d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/remote-signing',
                component: ComponentCreator('/validators/remote-signing', '614'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/security',
                component: ComponentCreator('/validators/security', '58b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/sentry-architecture',
                component: ComponentCreator('/validators/sentry-architecture', '7d4'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/slashing',
                component: ComponentCreator('/validators/slashing', '343'),
                exact: true,
                sidebar: "docsSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
