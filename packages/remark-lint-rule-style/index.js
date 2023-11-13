/**
 * ## When should I use this?
 *
 * You can use this package to check that rules (thematic breaks, horizontal
 * rules) are consistent.
 *
 * ## API
 *
 * The following options (default: `'consistent'`) are accepted:
 *
 * *   `string` (example: `'** * **'`, `'___'`)
 *     — thematic break to prefer
 * *   `'consistent'`
 *     — detect the first used style and warn when further rules differ
 *
 * ## Recommendation
 *
 * Rules consist of a `*`, `-`, or `_` character, which occurs at least three
 * times with nothing else except for arbitrary spaces or tabs on a single line.
 * Using spaces, tabs, and more than three markers seems unnecessary work to
 * type out.
 * Because asterisks can be used as a marker for more markdown constructs,
 * it’s recommended to use that for rules (and lists, emphasis, strong) too.
 * Due to this, it’s recommended to pass `'***'`.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * formats rules with `***` by default.
 * There are three settings to control rules:
 *
 * *   [`rule`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsrule)
 *     (default: `'*'`) — marker
 * *   [`ruleRepetition`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsrulerepetition)
 *     (default: `3`) — repetitions
 * *   [`ruleSpaces`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsrulespaces)
 *     (default: `false`) — use spaces between markers
 *
 * @module rule-style
 * @summary
 *   remark-lint rule to warn when rule markers are inconsistent.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md", "config": "* * *"}
 *
 *   * * *
 *
 *   * * *
 *
 * @example
 *   {"name": "ok.md", "config": "_______"}
 *
 *   _______
 *
 *   _______
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   ***
 *
 *   * * *
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:6: Rules should use `***`
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "config": "💩", "positionless": true}
 *
 *   1:1: Incorrect preferred rule style: provide a correct markdown rule or `'consistent'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {string} Options
 *   Configuration.
 */

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintRuleStyle = lintRule(
  {
    origin: 'remark-lint:rule-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-rule-style#readme'
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
    const value = String(file)
    let option = options || 'consistent'

    if (option !== 'consistent' && /[^-_* ]/.test(option)) {
      file.fail(
        "Incorrect preferred rule style: provide a correct markdown rule or `'consistent'`"
      )
    }

    visit(tree, 'thematicBreak', function (node) {
      const end = pointEnd(node)
      const start = pointStart(node)

      if (
        start &&
        end &&
        typeof start.offset === 'number' &&
        typeof end.offset === 'number'
      ) {
        const rule = value.slice(start.offset, end.offset)

        if (option === 'consistent') {
          option = rule
        } else if (rule !== option) {
          file.message('Rules should use `' + option + '`', node)
        }
      }
    })
  }
)

export default remarkLintRuleStyle
