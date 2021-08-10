/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-duplicate-headings-in-section
 * @fileoverview
 *   Warn when duplicate headings are found, but only when on the same level,
 *   “in” the same section.
 *
 * @example {"name": "ok.md"}
 *
 *   ## Alpha
 *
 *   ### Bravo
 *
 *   ## Charlie
 *
 *   ### Bravo
 *
 *   ### Delta
 *
 *   #### Bravo
 *
 *   #### Echo
 *
 *   ##### Bravo
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   ## Foxtrot
 *
 *   ### Golf
 *
 *   ### Golf
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   5:1-5:9: Do not use headings with similar content per section (3:1)
 *
 * @example {"name": "not-ok-tolerant-heading-increment.md", "label": "input"}
 *
 *   # Alpha
 *
 *   #### Bravo
 *
 *   ###### Charlie
 *
 *   #### Bravo
 *
 *   ###### Delta
 *
 * @example {"name": "not-ok-tolerant-heading-increment.md", "label": "output"}
 *
 *   7:1-7:11: Do not use headings with similar content per section (3:1)
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'
import {visit} from 'unist-util-visit'
import {stringifyPosition} from 'unist-util-stringify-position'
import {toString} from 'mdast-util-to-string'

const remarkLintNoDuplicateHeadingsInSection = lintRule(
  'remark-lint:no-duplicate-headings-in-section',
  noDuplicateHeadingsInSection
)

export default remarkLintNoDuplicateHeadingsInSection

var reason = 'Do not use headings with similar content per section'

function noDuplicateHeadingsInSection(tree, file) {
  var stack = []

  visit(tree, 'heading', visitor)

  function visitor(node) {
    var depth = node.depth
    var value = toString(node).toUpperCase()
    var index = depth - 1
    var scope = stack[index] || (stack[index] = {})
    var duplicate = scope[value]

    if (!generated(node) && duplicate) {
      file.message(
        reason + ' (' + stringifyPosition(pointStart(duplicate)) + ')',
        node
      )
    }

    scope[value] = node
    stack = stack.slice(0, depth)
  }
}
