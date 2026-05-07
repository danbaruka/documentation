import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
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
    component: ComponentCreator('/', '6a3'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '3c9'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'b74'),
            routes: [
              {
                path: '/cli/bank',
                component: ComponentCreator('/cli/bank', '299'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/governance',
                component: ComponentCreator('/cli/governance', '8f1'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/keys',
                component: ComponentCreator('/cli/keys', '78c'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/overview',
                component: ComponentCreator('/cli/overview', 'bed'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/query',
                component: ComponentCreator('/cli/query', 'd0a'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/cli/staking',
                component: ComponentCreator('/cli/staking', 'c06'),
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
                component: ComponentCreator('/developers/cosmjs', '327'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/developers/ibc-transfer',
                component: ComponentCreator('/developers/ibc-transfer', '4af'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/developers/quickstart',
                component: ComponentCreator('/developers/quickstart', 'c56'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/getting-started/quick-links',
                component: ComponentCreator('/getting-started/quick-links', '1a2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/getting-started/what-is-safrochain',
                component: ComponentCreator('/getting-started/what-is-safrochain', '70a'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/ibc/channels',
                component: ComponentCreator('/ibc/channels', '7f4'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/ibc/hermes-setup',
                component: ComponentCreator('/ibc/hermes-setup', '387'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/ibc/overview',
                component: ComponentCreator('/ibc/overview', '7e7'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/intro',
                component: ComponentCreator('/intro', 'd7a'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/auth',
                component: ComponentCreator('/modules/auth', '59e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/authz',
                component: ComponentCreator('/modules/authz', '8f6'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/bank',
                component: ComponentCreator('/modules/bank', 'a85'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/clock',
                component: ComponentCreator('/modules/clock', 'fa0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/consensus',
                component: ComponentCreator('/modules/consensus', '614'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/crisis',
                component: ComponentCreator('/modules/crisis', 'c43'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/cw-hooks',
                component: ComponentCreator('/modules/cw-hooks', 'bec'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/distribution',
                component: ComponentCreator('/modules/distribution', 'ed6'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/drip',
                component: ComponentCreator('/modules/drip', '32a'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/evidence',
                component: ComponentCreator('/modules/evidence', '5a8'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/feegrant',
                component: ComponentCreator('/modules/feegrant', 'd63'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/feepay',
                component: ComponentCreator('/modules/feepay', 'f39'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/feeshare',
                component: ComponentCreator('/modules/feeshare', '6c2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/globalfee',
                component: ComponentCreator('/modules/globalfee', '479'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/gov',
                component: ComponentCreator('/modules/gov', '0e1'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/ibc-core',
                component: ComponentCreator('/modules/ibc-core', '3b3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/ibc-fee',
                component: ComponentCreator('/modules/ibc-fee', '4cf'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/ibc-hooks',
                component: ComponentCreator('/modules/ibc-hooks', 'e86'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/ibc-transfer-app',
                component: ComponentCreator('/modules/ibc-transfer-app', '27d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/interchain-accounts',
                component: ComponentCreator('/modules/interchain-accounts', '153'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/interchain-query',
                component: ComponentCreator('/modules/interchain-query', 'eca'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/mint',
                component: ComponentCreator('/modules/mint', '235'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/nft',
                component: ComponentCreator('/modules/nft', '926'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/overview',
                component: ComponentCreator('/modules/overview', 'a00'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/params',
                component: ComponentCreator('/modules/params', 'b6f'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/slashing',
                component: ComponentCreator('/modules/slashing', '03d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/staking',
                component: ComponentCreator('/modules/staking', '622'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/tokenfactory',
                component: ComponentCreator('/modules/tokenfactory', 'a22'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/upgrade',
                component: ComponentCreator('/modules/upgrade', '88c'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/vesting',
                component: ComponentCreator('/modules/vesting', 'a4b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/modules/wasm',
                component: ComponentCreator('/modules/wasm', 'ff2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/chain-registry',
                component: ComponentCreator('/networks/chain-registry', 'b3f'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/mainnet-endpoints',
                component: ComponentCreator('/networks/mainnet-endpoints', '870'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/networks/testnet-endpoints',
                component: ComponentCreator('/networks/testnet-endpoints', 'e62'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/protocol/foundation',
                component: ComponentCreator('/protocol/foundation', '95f'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/protocol/governance',
                component: ComponentCreator('/protocol/governance', '95e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/protocol/tokenomics',
                component: ComponentCreator('/protocol/tokenomics', 'db0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/resources/brand-assets',
                component: ComponentCreator('/resources/brand-assets', '525'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/resources/faq',
                component: ComponentCreator('/resources/faq', 'faa'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/resources/whitepaper',
                component: ComponentCreator('/resources/whitepaper', 'cc3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/hardware',
                component: ComponentCreator('/run-a-node/hardware', '7f3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/install',
                component: ComponentCreator('/run-a-node/install', '61e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/join-mainnet',
                component: ComponentCreator('/run-a-node/join-mainnet', '7ff'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/join-testnet',
                component: ComponentCreator('/run-a-node/join-testnet', '2e2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/local-testnet',
                component: ComponentCreator('/run-a-node/local-testnet', '7f1'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/overview',
                component: ComponentCreator('/run-a-node/overview', '407'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/snapshots',
                component: ComponentCreator('/run-a-node/snapshots', 'daa'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/statesync',
                component: ComponentCreator('/run-a-node/statesync', 'ce6'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/run-a-node/upgrades',
                component: ComponentCreator('/run-a-node/upgrades', 'f17'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/alerting',
                component: ComponentCreator('/validators/alerting', 'c87'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/become-a-validator',
                component: ComponentCreator('/validators/become-a-validator', '5e3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/disaster-recovery',
                component: ComponentCreator('/validators/disaster-recovery', 'd98'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/key-management',
                component: ComponentCreator('/validators/key-management', '70f'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/monitoring',
                component: ComponentCreator('/validators/monitoring', '65c'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/operations',
                component: ComponentCreator('/validators/operations', 'bce'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/overview',
                component: ComponentCreator('/validators/overview', '094'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/remote-signing',
                component: ComponentCreator('/validators/remote-signing', '514'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/security',
                component: ComponentCreator('/validators/security', '9cc'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/sentry-architecture',
                component: ComponentCreator('/validators/sentry-architecture', 'd07'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/validators/slashing',
                component: ComponentCreator('/validators/slashing', 'd6a'),
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
