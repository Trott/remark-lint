/**
 * ## When should I use this?
 *
 * You can use this package to check that the “indent” of block quotes is
 * consistent.
 * Indent here is the `>` (greater than) marker and the spaces before content.
 *
 * ## API
 *
 * The following options (default: `'consistent'`) are accepted:
 *
 * *   `number` (example: `2`)
 *     — preferred indent of `>` and spaces before content
 * *   `'consistent'`
 *     — detect the first used style and warn when further block quotes differ
 *
 * ## Recommendation
 *
 * CommonMark specifies that when block quotes are used the `>` markers can be
 * followed by an optional space.
 * No space at all arguably looks rather ugly:
 *
 * ```markdown
 * >Mars and
 * >Venus.
 * ```
 *
 * There is no specific handling of more that one space, so if 5 spaces were
 * used after `>`, then indented code kicks in:
 *
 * ```markdown
 * >     neptune()
 * ```
 *
 * Due to this, it’s recommended to configure this rule with `2`.
 *
 * @module blockquote-indentation
 * @summary
 *   remark-lint rule to warn when block quotes are indented too much or
 *   too little.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md", "config": 4}
 *
 *   >   Hello
 *
 *   Paragraph.
 *
 *   >   World
 * @example
 *   {"name": "ok.md", "config": 2}
 *
 *   > Hello
 *
 *   Paragraph.
 *
 *   > World
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   >  Hello
 *
 *   Paragraph.
 *
 *   >   World
 *
 *   Paragraph.
 *
 *   > World
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   5:5: Remove 1 space between block quote and content
 *   9:3: Add 1 space between block quote and content
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {number | 'consistent'} Options
 *   Configuration.
 */

import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintBlockquoteIndentation = lintRule(
  {
    origin: 'remark-lint:blockquote-indentation',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-blockquote-indentation#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options='consistent']
   *   Configuration (default: `'consistent'`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    let option = options || 'consistent'

    visit(tree, 'blockquote', function (node) {
      const start = pointStart(node)
      const head = pointStart(node.children[0])

      if (head && start) {
        const count = head.column - start.column

        if (option === 'consistent') {
          option = count
        } else {
          const diff = option - count

          if (diff !== 0) {
            const abs = Math.abs(diff)

            file.message(
              (diff > 0 ? 'Add' : 'Remove') +
                ' ' +
                abs +
                ' ' +
                pluralize('space', abs) +
                ' between block quote and content',
              head
            )
          }
        }
      }
    })
  }
)

export default remarkLintBlockquoteIndentation
