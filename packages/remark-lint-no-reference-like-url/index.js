/**
 * ## When should I use this?
 *
 * You can use this package to check for broken URLs that should likely
 * have been references.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * While full URLs for definition identifiers are okay
 * (`[https://example.com]: https://example.com`), and what looks like an
 * identifier could be an actual URL (`[text](alpha)`), the more common case
 * is that, assuming a definition `[alpha]: https://example.com`, then a link
 * of (`[text](alpha)`) should instead’ve been `[text][alpha]`.
 *
 * @module no-reference-like-url
 * @summary
 *   remark-lint rule to warn when URLs are also defined identifiers.
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   [Alpha](http://example.com).
 *
 *   [bravo]: https://example.com
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [Charlie](delta).
 *
 *   [delta]: https://example.com
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:17: Did you mean to use `[delta]` instead of `(delta)`, a reference?
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintNoReferenceLikeUrl = lintRule(
  {
    origin: 'remark-lint:no-reference-like-url',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-reference-like-url#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    /** @type {Set<string>} */
    const identifiers = new Set()

    visit(tree, 'definition', function (node) {
      identifiers.add(node.identifier.toLowerCase())
    })

    visit(tree, function (node) {
      const place = position(node)

      if (
        place &&
        (node.type === 'image' || node.type === 'link') &&
        identifiers.has(node.url.toLowerCase())
      ) {
        file.message(
          'Did you mean to use `[' +
            node.url +
            ']` instead of ' +
            '`(' +
            node.url +
            ')`, a reference?',
          place
        )
      }
    })
  }
)

export default remarkLintNoReferenceLikeUrl
