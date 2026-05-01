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
    component: ComponentCreator('/', '8e8'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'a4c'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'b5e'),
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
                component: ComponentCreator('/developers/cosmjs', '22b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/developers/ibc-transfer',
                component: ComponentCreator('/developers/ibc-transfer', '9d3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/developers/quickstart',
                component: ComponentCreator('/developers/quickstart', 'ca3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/getting-started/quick-links',
                component: ComponentCreator('/getting-started/quick-links', '923'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/getting-started/what-is-safrochain',
                component: ComponentCreator('/getting-started/what-is-safrochain', '4df'),
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
                component: ComponentCreator('/intro', '9b9'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/auth',
                component: ComponentCreator('/modules/auth', 'c91'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/authz',
                component: ComponentCreator('/modules/authz', '692'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/bank',
                component: ComponentCreator('/modules/bank', 'b20'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/clock',
                component: ComponentCreator('/modules/clock', '493'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/consensus',
                component: ComponentCreator('/modules/consensus', '7e0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/crisis',
                component: ComponentCreator('/modules/crisis', '958'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/cw-hooks',
                component: ComponentCreator('/modules/cw-hooks', '473'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/distribution',
                component: ComponentCreator('/modules/distribution', 'f49'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/drip',
                component: ComponentCreator('/modules/drip', 'ca6'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/evidence',
                component: ComponentCreator('/modules/evidence', 'fb3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/feegrant',
                component: ComponentCreator('/modules/feegrant', 'c75'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/feepay',
                component: ComponentCreator('/modules/feepay', '3fa'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/feeshare',
                component: ComponentCreator('/modules/feeshare', 'df7'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/globalfee',
                component: ComponentCreator('/modules/globalfee', 'b27'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/gov',
                component: ComponentCreator('/modules/gov', '5e9'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/ibc-core',
                component: ComponentCreator('/modules/ibc-core', '1d0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/ibc-fee',
                component: ComponentCreator('/modules/ibc-fee', 'c42'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/ibc-hooks',
                component: ComponentCreator('/modules/ibc-hooks', 'c46'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/ibc-transfer-app',
                component: ComponentCreator('/modules/ibc-transfer-app', '5a7'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/interchain-accounts',
                component: ComponentCreator('/modules/interchain-accounts', '6f5'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/interchain-query',
                component: ComponentCreator('/modules/interchain-query', '444'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/mint',
                component: ComponentCreator('/modules/mint', '7d7'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/nft',
                component: ComponentCreator('/modules/nft', 'a44'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/overview',
                component: ComponentCreator('/modules/overview', '5e3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/params',
                component: ComponentCreator('/modules/params', 'd93'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/slashing',
                component: ComponentCreator('/modules/slashing', 'f0d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/staking',
                component: ComponentCreator('/modules/staking', '5c0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/tokenfactory',
                component: ComponentCreator('/modules/tokenfactory', 'b91'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/upgrade',
                component: ComponentCreator('/modules/upgrade', 'aa8'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/vesting',
                component: ComponentCreator('/modules/vesting', 'b6f'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/wasm',
                component: ComponentCreator('/modules/wasm', 'ae6'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/chain-registry',
                component: ComponentCreator('/networks/chain-registry', '078'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/mainnet-endpoints',
                component: ComponentCreator('/networks/mainnet-endpoints', '867'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/testnet-endpoints',
                component: ComponentCreator('/networks/testnet-endpoints', 'd44'),
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
                component: ComponentCreator('/run-a-node/install', '2f8'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/join-mainnet',
                component: ComponentCreator('/run-a-node/join-mainnet', 'e39'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/join-testnet',
                component: ComponentCreator('/run-a-node/join-testnet', 'f99'),
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
                component: ComponentCreator('/run-a-node/snapshots', 'aad'),
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
                component: ComponentCreator('/run-a-node/upgrades', '473'),
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
