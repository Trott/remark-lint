/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module rule-style
 * @fileoverview
 *   Warn when the thematic breaks (horizontal rules) violate a given or
 *   detected style.
 *
 *   Options: `string`, either a corect thematic breaks such as `***`, or
 *   `'consistent'`, default: `'consistent'`.
 *
 *   `'consistent'` detects the first used thematic break style and warns when
 *   subsequent rules use different styles.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   has three settings that define how rules are created:
 *
 *   *   [`rule`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify#optionsrule)
 *       (default: `*`) — Marker to use
 *   *   [`ruleRepetition`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify#optionsrulerepetition)
 *       (default: `3`) — Number of markers to use
 *   *   [`ruleSpaces`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify#optionsrulespaces)
 *       (default: `true`) — Whether to pad markers with spaces
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "ok.md", "setting": "* * *"}
 *
 *   * * *
 *
 *   * * *
 *
 * @example {"name": "ok.md", "setting": "_______"}
 *
 *   _______
 *
 *   _______
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   ***
 *
 *   * * *
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:6: Rules should use `***`
 *
 * @example {"name": "not-ok.md", "label": "output", "setting": "💩", "positionless": true}
 *
 *   1:1: Incorrect preferred rule style: provide a correct markdown rule or `'consistent'`
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintRuleStyle = lintRule('remark-lint:rule-style', ruleStyle)

export default remarkLintRuleStyle

function ruleStyle(tree, file, option) {
  var contents = String(file)
  var preferred =
    typeof option === 'string' && option !== 'consistent' ? option : null

  if (preferred !== null && /[^-_* ]/.test(preferred)) {
    file.fail(
      "Incorrect preferred rule style: provide a correct markdown rule or `'consistent'`"
    )
  }

  visit(tree, 'thematicBreak', visitor)

  function visitor(node) {
    var initial = pointStart(node).offset
    var final = pointEnd(node).offset
    var rule

    if (!generated(node)) {
      rule = contents.slice(initial, final)

      if (preferred) {
        if (rule !== preferred) {
          file.message('Rules should use `' + preferred + '`', node)
        }
      } else {
        preferred = rule
      }
    }
  }
}
