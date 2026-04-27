import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'Safrochain Docs',
  tagline: 'Cosmos SDK Layer-1: fast, affordable, real-utility blockchain',
  favicon: 'img/favicon.svg',

  url: 'https://docs.safrochain.com',
  baseUrl: '/',

  organizationName: 'Safrochain-Org',
  projectName: 'safrochain-docs',

  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  future: {
    faster: {
      // Work around webpack ProgressPlugin incompatibilities on newer Node versions.
      rspackBundler: true,
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: undefined,
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  clientModules: [require.resolve('./src/clientModules/back-nav-fix.ts')],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        // Cache-bust the prebuilt search index by content hash on every build.
        hashed: true,
        language: ['en'],
        // Single-route docs site: docs are served at `/`, not `/docs`.
        docsRouteBasePath: '/',
        // Pro-touch options.
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        searchResultLimits: 10,
        searchResultContextMaxLength: 80,
        explicitSearchResultPath: true,
        highlightSearchTermsOnTargetPage: true,
        // Keep common words searchable (good for technical docs).
        removeDefaultStopWordFilter: true,
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    image: 'img/og.png',
    navbar: {
      title: '',
      hideOnScroll: false,
      style: 'dark',
      logo: {
        alt: 'Safrochain',
        src: 'img/safrochain-full-logo-white.svg',
        srcDark: 'img/safrochain-full-logo-white.svg',
        width: 148,
        height: 38,
      },
      items: [
        {
          type: 'search',
          position: 'right',
        },
        {
          type: 'html',
          position: 'right',
          value:
            '<a class="safro-cta-hub" href="https://hub.safrochain.com/" target="_blank" rel="noopener noreferrer">Launch Hub</a>',
        },
        {
          type: 'html',
          position: 'right',
          value: `
<div class="safro-socials">
  <a class="safro-social" href="https://x.com/safrochain" target="_blank" rel="noopener noreferrer" aria-label="Safrochain on X">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  </a>
  <a class="safro-social" href="https://github.com/Safrochain-Org" target="_blank" rel="noopener noreferrer" aria-label="Safrochain on GitHub">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  </a>
  <a class="safro-social" href="https://t.me/safrochainannonce" target="_blank" rel="noopener noreferrer" aria-label="Safrochain on Telegram">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.04 15.47 8.9 19.2c.5 0 .72-.22.98-.48l2.35-2.25 4.86 3.56c.89.49 1.52.23 1.76-.82l3.19-14.96h0c.29-1.35-.49-1.88-1.34-1.56L1.9 10.02c-1.31.51-1.29 1.24-.24 1.57l4.88 1.52L18.1 6.06c.54-.33 1.03-.15.62.18"/>
    </svg>
  </a>
  <a class="safro-social" href="https://discord.gg/fe2XAm6ENQ" target="_blank" rel="noopener noreferrer" aria-label="Safrochain on Discord">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.608 1.249-1.845-.276-3.68-.276-5.486 0-.164-.393-.406-.874-.617-1.249a.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.027c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.12 13.12 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.125-.094.25-.192.368-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.119.099.243.198.369.292a.077.077 0 0 1-.006.127 12.4 12.4 0 0 1-1.873.892.077.077 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.88 19.88 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.673-3.548-13.66a.061.061 0 0 0-.031-.028zM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.955 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.419-2.157 2.419z"/>
    </svg>
  </a>
  <a class="safro-social" href="https://medium.com/@safrochain" target="_blank" rel="noopener noreferrer" aria-label="Safrochain on Medium">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.37 7.07c.02-.2-.05-.4-.19-.54L2.68 4.72V4.5h4.66l3.6 7.9 3.17-7.9h4.45v.22l-1.28 1.23a.43.43 0 0 0-.16.41v9.02a.43.43 0 0 0 .16.41l1.25 1.23v.22h-6.3v-.22l1.29-1.26c.13-.13.13-.17.13-.41V7.74l-3.6 9.96h-.49l-4.19-9.96v5.56c-.04.26.05.53.24.72l1.68 2.04v.22H2.53v-.22l1.68-2.04c.18-.19.26-.46.22-.72V7.07z"/>
    </svg>
  </a>
</div>
          `.trim(),
        },
      ],
    },
    footer: {
      style: 'dark',
      // The whole footer is rendered via the `copyright` slot so we can lay it
      // out in a multi-column grid (logo + brand info, link columns, social
      // icons, then a legal/copyright row underneath). `links` stays empty.
      links: [],
      copyright: `
<div class="safro-footer">
  <div class="safro-footer-top">
    <div class="safro-foot-brand">
      <img src="/img/safrochain-full-logo-white.svg" alt="Safrochain" />
      <div class="safro-foot-brand-name">Safrochain Foundation</div>
      <div class="safro-foot-brand-line">Cosmos SDK Layer-1</div>
      <div class="safro-foot-brand-line">Mobile-first payments &amp; remittances</div>
      <a href="mailto:hello@safrochain.com">hello@safrochain.com</a>
    </div>

    <div class="safro-foot-divider" aria-hidden="true"></div>

    <div class="safro-foot-col">
      <div class="safro-foot-col-title">Network</div>
      <a href="/networks/mainnet-endpoints">Mainnet endpoints</a>
      <a href="/networks/testnet-endpoints">Testnet endpoints</a>
      <a href="/networks/chain-registry">Chain registry</a>
      <a href="https://explorer.safrochain.com/" target="_blank" rel="noopener noreferrer">Explorer</a>
      <a href="https://faucet.safrochain.com/" target="_blank" rel="noopener noreferrer">Faucet</a>
      <a href="https://status.safrochain.network" target="_blank" rel="noopener noreferrer">Status</a>
    </div>

    <div class="safro-foot-col">
      <div class="safro-foot-col-title">Operators</div>
      <a href="/run-a-node/overview">Run a node</a>
      <a href="/validators/become-a-validator">Become a validator</a>
      <a href="/validators/slashing">Slashing &amp; jail</a>
      <a href="/ibc/overview">IBC &amp; relayers</a>
      <a href="/cli/overview">CLI reference</a>
      <a href="/modules/overview">Modules</a>
    </div>

    <div class="safro-foot-col">
      <div class="safro-foot-col-title">About</div>
      <a href="/protocol/tokenomics">Tokenomics</a>
      <a href="/protocol/governance">Governance</a>
      <a href="/protocol/foundation">Foundation</a>
      <a href="/resources/whitepaper">Whitepaper</a>
      <a href="/resources/brand-assets">Brand assets</a>
      <a href="/resources/faq">FAQ</a>
    </div>

    <div class="safro-foot-join">
      <div class="safro-foot-col-title">Join us on</div>
      <div class="safro-foot-icons">
        <a class="safro-foot-icon" href="https://github.com/Safrochain-Org" target="_blank" rel="noopener noreferrer" aria-label="Safrochain on GitHub">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
        </a>
        <a class="safro-foot-icon" href="https://discord.gg/fe2XAm6ENQ" target="_blank" rel="noopener noreferrer" aria-label="Safrochain on Discord">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.608 1.249-1.845-.276-3.68-.276-5.486 0-.164-.393-.406-.874-.617-1.249a.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.027c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.12 13.12 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.125-.094.25-.192.368-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.119.099.243.198.369.292a.077.077 0 0 1-.006.127 12.4 12.4 0 0 1-1.873.892.077.077 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.88 19.88 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.673-3.548-13.66a.061.061 0 0 0-.031-.028zM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.955 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.419-2.157 2.419z"/>
          </svg>
        </a>
        <a class="safro-foot-icon" href="https://x.com/safrochain" target="_blank" rel="noopener noreferrer" aria-label="Safrochain on X">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a class="safro-foot-icon" href="https://t.me/safrochainannonce" target="_blank" rel="noopener noreferrer" aria-label="Safrochain on Telegram">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9.04 15.47 8.9 19.2c.5 0 .72-.22.98-.48l2.35-2.25 4.86 3.56c.89.49 1.52.23 1.76-.82l3.19-14.96h0c.29-1.35-.49-1.88-1.34-1.56L1.9 10.02c-1.31.51-1.29 1.24-.24 1.57l4.88 1.52L18.1 6.06c.54-.33 1.03-.15.62.18"/>
          </svg>
        </a>
        <a class="safro-foot-icon" href="https://medium.com/@safrochain" target="_blank" rel="noopener noreferrer" aria-label="Safrochain on Medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4.37 7.07c.02-.2-.05-.4-.19-.54L2.68 4.72V4.5h4.66l3.6 7.9 3.17-7.9h4.45v.22l-1.28 1.23a.43.43 0 0 0-.16.41v9.02a.43.43 0 0 0 .16.41l1.25 1.23v.22h-6.3v-.22l1.29-1.26c.13-.13.13-.17.13-.41V7.74l-3.6 9.96h-.49l-4.19-9.96v5.56c-.04.26.05.53.24.72l1.68 2.04v.22H2.53v-.22l1.68-2.04c.18-.19.26-.46.22-.72V7.07z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>

  <div class="safro-footer-bottom">
    <div class="safro-foot-legal">
      <a href="https://safrochain.com/legal/terms" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>
      <a href="https://safrochain.com/legal/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
    </div>
    <div class="safro-foot-copyright">
      © ${new Date().getFullYear()} Safrochain Foundation · Built for Africa, open to the world
      <span class="safro-foot-heart" aria-hidden="true">♥</span>
    </div>
  </div>
</div>
      `.trim(),
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'toml', 'yaml'],
    },
  },

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap',
      type: 'text/css',
    },
  ],
};

export default config;

