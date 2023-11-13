/**
 * ## When should I use this?
 *
 * You can use this package to check that identifiers are defined once.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * It’s a mistake when the same identifier is defined multiple times.
 *
 * @module no-duplicate-definitions
 * @summary
 *   remark-lint rule to warn when identifiers are defined multiple times.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   [foo]: bar
 *   [baz]: qux
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [foo]: bar
 *   [foo]: qux
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   2:1-2:11: Do not use definitions with the same identifier (1:1)
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart, position} from 'unist-util-position'
import {stringifyPosition} from 'unist-util-stringify-position'
import {visit} from 'unist-util-visit'

const remarkLintNoDuplicateDefinitions = lintRule(
  {
    origin: 'remark-lint:no-duplicate-definitions',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-duplicate-definitions#readme'
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

    visit(tree, function (node) {
      const place = position(node)
      const start = pointStart(node)

      if (
        (node.type === 'definition' || node.type === 'footnoteDefinition') &&
        place &&
        start
      ) {
        const identifier = node.identifier
        const duplicate = map.get(identifier)

        if (duplicate) {
          file.message(
            'Do not use definitions with the same identifier (' +
              duplicate +
              ')',
            place
          )
        }

        map.set(identifier, stringifyPosition(start))
      }
    })
  }
)

export default remarkLintNoDuplicateDefinitions
