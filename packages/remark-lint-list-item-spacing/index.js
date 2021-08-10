/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module list-item-spacing
 * @fileoverview
 *   Warn when list looseness is incorrect, such as being tight when it should
 *   be loose, and vice versa.
 *
 *   According to the [`markdown-style-guide`](http://www.cirosantilli.com/markdown-style-guide/),
 *   if one or more list items in a list spans more than one line, the list is
 *   required to have blank lines between each item.
 *   And otherwise, there should not be blank lines between items.
 *
 *   By default, all items must be spread out (a blank line must be between
 *   them) if one or more items are multiline (span more than one line).
 *   Otherwise, the list must be tight (no blank line must be between items).
 *
 *   If you pass `{checkBlanks: true}`, all items must be spread out if one or
 *   more items contain blank lines.
 *   Otherwise, the list must be tight.
 *
 * @example {"name": "ok.md"}
 *
 *   A tight list:
 *
 *   -   item 1
 *   -   item 2
 *   -   item 3
 *
 *   A loose list:
 *
 *   -   Wrapped
 *       item
 *
 *   -   item 2
 *
 *   -   item 3
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   A tight list:
 *
 *   -   Wrapped
 *       item
 *   -   item 2
 *   -   item 3
 *
 *   A loose list:
 *
 *   -   item 1
 *
 *   -   item 2
 *
 *   -   item 3
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   4:9-5:1: Missing new line after list item
 *   5:11-6:1: Missing new line after list item
 *   10:11-12:1: Extraneous new line after list item
 *   12:11-14:1: Extraneous new line after list item
 *
 * @example {"name": "ok.md", "setting": {"checkBlanks": true}}
 *
 *   A tight list:
 *
 *   -   item 1
 *       - item 1.A
 *   -   item 2
 *       > Block quote
 *
 *   A loose list:
 *
 *   -   item 1
 *
 *       - item 1.A
 *
 *   -   item 2
 *
 *       > Block quote
 *
 * @example {"name": "not-ok.md", "setting": {"checkBlanks": true}, "label": "input"}
 *
 *   A tight list:
 *
 *   -   item 1
 *
 *       - item 1.A
 *   -   item 2
 *
 *       > Block quote
 *   -   item 3
 *
 *   A loose list:
 *
 *   -   item 1
 *       - item 1.A
 *
 *   -   item 2
 *       > Block quote
 *
 * @example {"name": "not-ok.md", "setting": {"checkBlanks": true}, "label": "output"}
 *
 *   5:15-6:1: Missing new line after list item
 *   8:18-9:1: Missing new line after list item
 *   14:15-16:1: Extraneous new line after list item
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintListItemSpacing = lintRule(
  'remark-lint:list-item-spacing',
  listItemSpacing
)

export default remarkLintListItemSpacing

var reasonLoose = 'Missing new line after list item'
var reasonTight = 'Extraneous new line after list item'

function listItemSpacing(tree, file, option) {
  var infer =
    option && typeof option === 'object' && option.checkBlanks
      ? inferBlankLine
      : inferMultiline

  visit(tree, 'list', visitor)

  function visitor(node) {
    var tight = true
    var children
    var length
    var index
    var child
    var next

    if (!generated(node)) {
      children = node.children
      length = children.length
      index = -1

      while (++index < length) {
        if (infer(children[index])) {
          tight = false
          break
        }
      }

      child = children[0]
      index = 0 // Skip over first.

      while (++index < length) {
        next = children[index]

        if (pointStart(next).line - pointEnd(child).line < 2 !== tight) {
          file.message(tight ? reasonTight : reasonLoose, {
            start: pointEnd(child),
            end: pointStart(next)
          })
        }

        child = next
      }
    }
  }
}

function inferBlankLine(node) {
  var children = node.children
  var child = children[0]
  var length = children.length
  var index = 0
  var next

  while (++index < length) {
    next = children[index]

    // All children in `listItem`s are block.
    if (pointStart(next).line - pointEnd(child).line > 1) {
      return true
    }

    child = next
  }

  return false
}

function inferMultiline(node) {
  var children = node.children
  return (
    pointEnd(children[children.length - 1]).line -
      pointStart(children[0]).line >
    0
  )
}
