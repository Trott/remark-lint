/**
 * remark-lint rule to warn when headings end in punctuation.
 *
 * ## What is this?
 *
 * This package checks the style of hedings.
 *
 * ## When should I use this?
 *
 * You can use this package to check that heading text is consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoHeadingPunctuation[, options])`
 *
 * Warn when headings end in punctuation.
 *
 * ###### Parameters
 *
 * * `options` (`string`, default: `'!,\\.:;?'`)
 *   — configuration,
 *   wrapped in `new RegExp('[' + x + ']')` so make sure to escape regexp
 *   characters
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-no-heading-punctuation]: #unifieduseremarklintnoheadingpunctuation-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-heading-punctuation
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   # Hello
 *
 * @example
 *   {"name": "ok.md", "config": ",;:!?"}
 *
 *   # Hello…
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   # Hello:
 *
 *   # Hello?
 *
 *   # Hello!
 *
 *   # Hello,
 *
 *   # Hello;
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:9: Don’t add a trailing `:` to headings
 *   3:1-3:9: Don’t add a trailing `?` to headings
 *   5:1-5:9: Don’t add a trailing `!` to headings
 *   7:1-7:9: Don’t add a trailing `,` to headings
 *   9:1-9:9: Don’t add a trailing `;` to headings
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {toString} from 'mdast-util-to-string'
import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintNoHeadingPunctuation = lintRule(
  {
    origin: 'remark-lint:no-heading-punctuation',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-punctuation#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {string | null | undefined} [options]
   *   Configuration (default: `'!,\\.:;?'`),
   *   wrapped in `new RegExp('[' + x + ']')` so make sure to double escape
   *   regexp characters.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const expression = new RegExp('[' + (options || '!,\\.:;?') + ']')

    visit(tree, 'heading', function (node) {
      const place = position(node)

      if (place) {
        const value = toString(node)
        const tail = value.charAt(value.length - 1)

        if (expression.test(tail)) {
          file.message('Don’t add a trailing `' + tail + '` to headings', place)
        }
      }
    })
  }
)

export default remarkLintNoHeadingPunctuation
