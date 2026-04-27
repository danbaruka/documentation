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
    component: ComponentCreator('/', '42e'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '7d9'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '4bb'),
            routes: [
              {
                path: '/cli/bank',
                component: ComponentCreator('/cli/bank', '292'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/governance',
                component: ComponentCreator('/cli/governance', '600'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/keys',
                component: ComponentCreator('/cli/keys', '260'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/overview',
                component: ComponentCreator('/cli/overview', 'c76'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/query',
                component: ComponentCreator('/cli/query', '400'),
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
                component: ComponentCreator('/cli/tx', '136'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/getting-started/quick-links',
                component: ComponentCreator('/getting-started/quick-links', 'ee0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/getting-started/what-is-safrochain',
                component: ComponentCreator('/getting-started/what-is-safrochain', '624'),
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
                component: ComponentCreator('/ibc/overview', '3dd'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/intro',
                component: ComponentCreator('/intro', 'fa3'),
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
                path: '/modules/cw-hooks',
                component: ComponentCreator('/modules/cw-hooks', '7d6'),
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
                path: '/modules/overview',
                component: ComponentCreator('/modules/overview', '919'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/chain-registry',
                component: ComponentCreator('/networks/chain-registry', '238'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/mainnet-endpoints',
                component: ComponentCreator('/networks/mainnet-endpoints', '3bd'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/testnet-endpoints',
                component: ComponentCreator('/networks/testnet-endpoints', '992'),
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
                component: ComponentCreator('/protocol/tokenomics', 'dfc'),
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
                component: ComponentCreator('/run-a-node/overview', '30e'),
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
                path: '/validators/become-a-validator',
                component: ComponentCreator('/validators/become-a-validator', '4e3'),
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
