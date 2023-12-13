/**
 * remark-lint rule to warn when definitions are used *in* the
 * document instead of at the end.
 *
 * ## What is this?
 *
 * This package checks where definitions are placed.
 *
 * ## When should I use this?
 *
 * You can use this package to check that definitions are consistently at the
 * end of the document.
 *
 * ## API
 *
 * ### `unified().use(remarkLintFinalDefinition)`
 *
 * Warn when definitions are used *in* the document instead of at the end.
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
 * There are different strategies for placing definitions.
 * The simplest is perhaps to place them all at the bottem of documents.
 * If you prefer that, turn on this rule.
 *
 * [api-remark-lint-final-definition]: #unifieduseremarklintfinaldefinition
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module final-definition
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   Paragraph.
 *
 *   [example]: http://example.com "Example Domain"
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   Paragraph.
 *
 *   [example]: http://example.com "Example Domain"
 *
 *   Another paragraph.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:47: Move definitions to the end of the file (after the node at line `5`)
 *
 * @example
 *   {"name": "ok-comments.md"}
 *
 *   Paragraph.
 *
 *   [example-1]: http://example.com/one/
 *
 *   <!-- Comments are fine between and after definitions -->
 *
 *   [example-2]: http://example.com/two/
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintFinalDefinition = lintRule(
  {
    origin: 'remark-lint:final-definition',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-definition#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    let last = 0

    visit(
      tree,
      function (node) {
        const start = pointStart(node)

        // To do: ignore MDX comments?
        // Ignore generated and HTML comment nodes.
        if (
          !start ||
          node.type === 'root' ||
          (node.type === 'html' && /^\s*<!--/.test(node.value))
        ) {
          return
        }

        const line = start.line

        if (node.type === 'definition') {
          if (last && last > line) {
            file.message(
              'Move definitions to the end of the file (after the node at line `' +
                last +
                '`)',
              node
            )
          }
        } else if (last === 0) {
          last = line
        }
      },
      true
    )
  }
)

export default remarkLintFinalDefinition
