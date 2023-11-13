/**
 * ## When should I use this?
 *
 * You can use this package to check that blank lines are used between blocks.
 *
 * ## API
 *
 * The following options (default: `undefined`) are accepted:
 *
 * *   `Object` with the following fields:
 *     *   `exceptTightLists` (`boolean`, default: `false`)
 *         — allow tight list items
 *
 * ## Recommendation
 *
 * While not always required, blank lines are required in certain, sometimes
 * confusing, cases.
 * Due to this, it’s recommended to always use blank lines between blocks.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * always uses blank lines between blocks.
 * It has a `join` function to customize such behavior.
 *
 * @module no-missing-blank-lines
 * @summary
 *   remark-lint rule to warn when blank lines are missing.
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
 *   - Paragraph
 *
 *     + List.
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   # Foo
 *   ## Bar
 *
 *   - Paragraph
 *     + List.
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   2:1-2:7: Missing blank line before block node
 *   5:3-5:10: Missing blank line before block node
 *
 * @example
 *   {"name": "tight.md", "config": {"exceptTightLists": true}, "label": "input"}
 *
 *   # Foo
 *   ## Bar
 *
 *   - Paragraph
 *     + List.
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "tight.md", "config": {"exceptTightLists": true}, "label": "output"}
 *
 *   2:1-2:7: Missing blank line before block node
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [exceptTightLists=false]
 *   Allow tight list items (default: `false`).
 */

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const types = new Set([
  'paragraph',
  'heading',
  'thematicBreak',
  'blockquote',
  'list',
  'table',
  'html',
  'code',
  'yaml'
])

const remarkLintNoMissingBlankLines = lintRule(
  {
    origin: 'remark-lint:no-missing-blank-lines',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-missing-blank-lines#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options]
   *   Configuration (optional).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const exceptTightLists = options ? options.exceptTightLists : false

    visit(tree, function (node, index, parent) {
      const end = pointEnd(node)

      if (
        parent &&
        typeof index === 'number' &&
        end &&
        (!exceptTightLists || parent.type !== 'listItem')
      ) {
        const next = parent.children[index + 1]
        const nextPoint = pointStart(next)

        if (
          next &&
          nextPoint &&
          types.has(next.type) &&
          nextPoint.line === end.line + 1
        ) {
          file.message('Missing blank line before block node', next)
        }
      }
    })
  }
)

export default remarkLintNoMissingBlankLines
