/**
 * remark-lint rule to warn when the same text is used in multiple headings.
 *
 * ## What is this?
 *
 * This package checks that headings are unique.
 *
 * ## When should I use this?
 *
 * You can use this package to check that headings are unique.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoDuplicateHeadings)`
 *
 * Warn when the same text is used in multiple headings.
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
 * Headings having unique text helps screen reader users,
 * who typically use “jump to heading” features to navigate within a page,
 * which reads headings out loud.
 *
 * It also helps because often headings receive automatic unique IDs,
 * and when the same heading text is used,
 * they are suffixed with a number based on where they are positioned in the
 * document,
 * which makes linking to them prone to changes.
 *
 * [api-remark-lint-no-duplicate-headings]: #unifieduseremarklintnoduplicateheadings
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-duplicate-headings
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   # Foo
 *
 *   ## Bar
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   # Foo
 *
 *   ## Foo
 *
 *   ## [Foo](http://foo.com/bar)
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:7: Do not use headings with similar content (1:1)
 *   5:1-5:29: Do not use headings with similar content (3:1)
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {toString} from 'mdast-util-to-string'
import {lintRule} from 'unified-lint-rule'
import {pointStart, position} from 'unist-util-position'
import {stringifyPosition} from 'unist-util-stringify-position'
import {visit} from 'unist-util-visit'

const remarkLintNoDuplicateHeadings = lintRule(
  {
    origin: 'remark-lint:no-duplicate-headings',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-duplicate-headings#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    /** @type {Map<string, string>} */
    const map = new Map()

    visit(tree, 'heading', function (node) {
      const place = position(node)
      const start = pointStart(node)

      if (place && start) {
        const value = toString(node).toUpperCase()
        const duplicate = map.get(value)

        if (duplicate) {
          file.message(
            'Do not use headings with similar content (' + duplicate + ')',
            node
          )
        }

        map.set(value, stringifyPosition(start))
      }
    })
  }
)

export default remarkLintNoDuplicateHeadings
