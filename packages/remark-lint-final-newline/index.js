/**
 * remark-lint rule to warn when a final line ending is missing.
 *
 * ## What is this?
 *
 * This package checks the final line ending.
 *
 * ## When should I use this?
 *
 * You can use this package to check final line endings.
 *
 * ## API
 *
 * ### `unified().use(remarkLintFinalNewline)`
 *
 * Warn when a final line ending is missing.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ## Recommendation
 *
 * Turn this rule on.
 * See [StackExchange][] for more info.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * always adds final line endings.
 *
 * [api-remark-lint-final-newline]: #unifieduseremarklintfinalnewline
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 * [stackexchange]: https://unix.stackexchange.com/questions/18743
 *
 * ## Example
 *
 * ##### `ok.md`
 *
 * ###### In
 *
 * > 👉 **Note**: `␊` represents a line feed (`\n`).
 *
 * ```markdown
 * Alpha␊
 * ```
 *
 * ###### Out
 *
 * No messages.
 *
 * ##### `not-ok.md`
 *
 * ###### In
 *
 * > 👉 **Note**: `␀` represents the end of the file.
 *
 * ```markdown
 * Bravo␀
 * ```
 *
 * ###### Out
 *
 * ```text
 * 1:1: Missing newline character at end of file
 * ```
 *
 * @module final-newline
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'

const remarkLintFinalNewline = lintRule(
  {
    origin: 'remark-lint:final-newline',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-newline#readme'
  },
  /**
   * @param {Root} _
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (_, file) {
    const value = String(file)
    const last = value.length - 1

    if (last > -1 && value.charAt(last) !== '\n') {
      // To do: warn at last character.
      file.message('Missing newline character at end of file')
    }
  }
)

export default remarkLintFinalNewline
