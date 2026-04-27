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
      items: ['validators/become-a-validator', 'validators/slashing'],
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
          items: [
            'modules/overview',
            'modules/feepay',
            'modules/feeshare',
            'modules/drip',
            'modules/clock',
            'modules/cw-hooks',
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
