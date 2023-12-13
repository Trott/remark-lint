/**
 * remark-lint rule to warn when “headings” have too many hashes.
 *
 * ## What is this?
 *
 * This package checks for broken headings.
 *
 * ## When should I use this?
 *
 * You can use this package to ensure that no broken headings are user, which
 * instead will result in paragraphs with the `#` characters shown.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoHeadingLikeParagraph)`
 *
 * Warn when “headings” have too many hashes.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-no-heading-like-paragraph]: #unifieduseremarklintnoheadinglikeparagraph
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-heading-like-paragraph
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   ###### Alpha
 *
 *   Bravo.
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   ####### Charlie
 *
 *   Delta.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:16: This looks like a heading but has too many hashes
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const fence = '#######'

const remarkLintNoHeadingLikeParagraph = lintRule(
  {
    origin: 'remark-lint:no-heading-like-paragraph',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-like-paragraph#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visit(tree, 'paragraph', function (node) {
      const place = position(node)

      if (place) {
        const head = node.children[0]

        if (
          head &&
          head.type === 'text' &&
          head.value.slice(0, fence.length) === fence
        ) {
          file.message(
            'This looks like a heading but has too many hashes',
            place
          )
        }
      }
    })
  }
)

export default remarkLintNoHeadingLikeParagraph
