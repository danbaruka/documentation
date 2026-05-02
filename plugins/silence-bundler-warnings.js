/**
 * Suppress noisy "Critical dependency: require..." warnings from UMD builds of
 * vscode-languageserver-types (transitive dep of Mermaid / IDE-related tooling).
 * The bundle still succeeds; static analysis just cannot trace dynamic requires.
 *
 * @returns {import('@docusaurus/types').Plugin}
 */
module.exports = function silenceBundlerWarningsPlugin() {
  return {
    name: 'silence-bundler-warnings',
    configureWebpack() {
      return {
        ignoreWarnings: [
          (warning) => {
            const msg =
              typeof warning === 'string'
                ? warning
                : warning?.message ?? warning?.details ?? '';
            const mod =
              typeof warning === 'object' && warning !== null
                ? warning.module?.resource ??
                  warning.moduleIdentifier ??
                  warning.file ??
                  ''
                : '';
            const text = `${msg} ${mod}`;
            return (
              text.includes('Critical dependency') &&
              text.includes('vscode-languageserver-types')
            );
          },
        ],
      };
    },
  };
};
