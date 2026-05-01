import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: [
        'intro',
        'getting-started/what-is-safrochain',
        'getting-started/quick-links',
      ],
    },
    {
      type: 'category',
      label: 'Networks',
      collapsed: false,
      items: [
        'networks/mainnet-endpoints',
        'networks/testnet-endpoints',
        'networks/chain-registry',
      ],
    },
    {
      type: 'category',
      label: 'Run a Node',
      collapsed: true,
      items: [
        'run-a-node/overview',
        'run-a-node/install',
        'run-a-node/hardware',
        'run-a-node/local-testnet',
        'run-a-node/join-testnet',
        'run-a-node/join-mainnet',
        'run-a-node/snapshots',
        'run-a-node/statesync',
        'run-a-node/upgrades',
      ],
    },
    {
      type: 'category',
      label: 'Validators',
      collapsed: true,
      link: { type: 'doc', id: 'validators/overview' },
      items: [
        'validators/overview',
        'validators/become-a-validator',
        {
          type: 'category',
          label: 'Keys & signing',
          collapsed: true,
          items: [
            'validators/key-management',
            'validators/remote-signing',
          ],
        },
        'validators/sentry-architecture',
        {
          type: 'category',
          label: 'Monitoring & alerting',
          collapsed: true,
          items: [
            'validators/monitoring',
            'validators/alerting',
          ],
        },
        'validators/operations',
        'validators/security',
        'validators/disaster-recovery',
        'validators/slashing',
      ],
    },
    {
      type: 'category',
      label: 'IBC & Relayers',
      collapsed: true,
      items: ['ibc/overview', 'ibc/hermes-setup', 'ibc/channels'],
    },
    {
      type: 'category',
      label: 'Developers',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'Build on Safrochain',
          collapsed: true,
          items: [
            'developers/quickstart',
            'developers/cosmjs',
            'developers/ibc-transfer',
          ],
        },
        {
          type: 'category',
          label: 'CLI Reference',
          collapsed: true,
          items: [
            'cli/overview',
            'cli/keys',
            'cli/bank',
            'cli/staking',
            'cli/governance',
            'cli/query',
            'cli/tx',
          ],
        },
        {
          type: 'category',
          label: 'Modules',
          collapsed: true,
          link: { type: 'doc', id: 'modules/overview' },
          items: [
            'modules/overview',
            {
              type: 'category',
              label: 'Safrochain modules',
              collapsed: true,
              items: [
                'modules/tokenfactory',
                'modules/globalfee',
                'modules/feepay',
                'modules/feeshare',
                'modules/drip',
                'modules/clock',
                'modules/cw-hooks',
              ],
            },
            {
              type: 'category',
              label: 'Cosmos SDK',
              collapsed: true,
              items: [
                'modules/auth',
                'modules/bank',
                'modules/staking',
                'modules/gov',
                'modules/mint',
                'modules/slashing',
                'modules/distribution',
                'modules/evidence',
                'modules/feegrant',
                'modules/authz',
                'modules/nft',
                'modules/consensus',
                'modules/params',
                'modules/upgrade',
                'modules/crisis',
                'modules/vesting',
              ],
            },
            {
              type: 'category',
              label: 'IBC',
              collapsed: true,
              items: [
                'modules/ibc-core',
                'modules/ibc-transfer-app',
                'modules/ibc-fee',
                'modules/interchain-accounts',
                'modules/interchain-query',
                'modules/ibc-hooks',
              ],
            },
            {
              type: 'category',
              label: 'CosmWasm',
              collapsed: true,
              items: ['modules/wasm'],
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'About',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'Protocol',
          collapsed: true,
          items: [
            'protocol/tokenomics',
            'protocol/governance',
            'protocol/foundation',
          ],
        },
        {
          type: 'category',
          label: 'Resources',
          collapsed: true,
          items: [
            'resources/whitepaper',
            'resources/brand-assets',
            'resources/faq',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
