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
    component: ComponentCreator('/', '0d5'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '35d'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '6a0'),
            routes: [
              {
                path: '/cli/bank',
                component: ComponentCreator('/cli/bank', '073'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/governance',
                component: ComponentCreator('/cli/governance', '95d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/keys',
                component: ComponentCreator('/cli/keys', 'b20'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/overview',
                component: ComponentCreator('/cli/overview', 'e41'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/query',
                component: ComponentCreator('/cli/query', 'fa7'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/staking',
                component: ComponentCreator('/cli/staking', 'd28'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/tx',
                component: ComponentCreator('/cli/tx', '293'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/getting-started/quick-links',
                component: ComponentCreator('/getting-started/quick-links', 'b3f'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/getting-started/what-is-safrochain',
                component: ComponentCreator('/getting-started/what-is-safrochain', '16e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/ibc/channels',
                component: ComponentCreator('/ibc/channels', 'e57'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/ibc/hermes-setup',
                component: ComponentCreator('/ibc/hermes-setup', '593'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/ibc/overview',
                component: ComponentCreator('/ibc/overview', '672'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/intro',
                component: ComponentCreator('/intro', '4a2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/clock',
                component: ComponentCreator('/modules/clock', '7e5'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/cw-hooks',
                component: ComponentCreator('/modules/cw-hooks', 'a5e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/drip',
                component: ComponentCreator('/modules/drip', '4d3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/feepay',
                component: ComponentCreator('/modules/feepay', 'e26'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/feeshare',
                component: ComponentCreator('/modules/feeshare', '5b2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/overview',
                component: ComponentCreator('/modules/overview', '1f0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/chain-registry',
                component: ComponentCreator('/networks/chain-registry', '06b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/mainnet-endpoints',
                component: ComponentCreator('/networks/mainnet-endpoints', '480'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/testnet-endpoints',
                component: ComponentCreator('/networks/testnet-endpoints', '015'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/protocol/foundation',
                component: ComponentCreator('/protocol/foundation', '360'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/protocol/governance',
                component: ComponentCreator('/protocol/governance', '54a'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/protocol/tokenomics',
                component: ComponentCreator('/protocol/tokenomics', '627'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/resources/brand-assets',
                component: ComponentCreator('/resources/brand-assets', 'efc'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/resources/faq',
                component: ComponentCreator('/resources/faq', '982'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/resources/whitepaper',
                component: ComponentCreator('/resources/whitepaper', '926'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/hardware',
                component: ComponentCreator('/run-a-node/hardware', 'd00'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/install',
                component: ComponentCreator('/run-a-node/install', '4ba'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/join-mainnet',
                component: ComponentCreator('/run-a-node/join-mainnet', 'bb4'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/join-testnet',
                component: ComponentCreator('/run-a-node/join-testnet', 'd82'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/local-testnet',
                component: ComponentCreator('/run-a-node/local-testnet', '7f7'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/overview',
                component: ComponentCreator('/run-a-node/overview', '335'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/snapshots',
                component: ComponentCreator('/run-a-node/snapshots', 'e10'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/statesync',
                component: ComponentCreator('/run-a-node/statesync', 'a4c'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/upgrades',
                component: ComponentCreator('/run-a-node/upgrades', '9c8'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/become-a-validator',
                component: ComponentCreator('/validators/become-a-validator', '6d2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/slashing',
                component: ComponentCreator('/validators/slashing', 'a22'),
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
