<!--This file is generated-->

# remark-lint-no-missing-blank-lines

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when blank lines are missing.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintNoMissingBlankLines[, options])`](#unifieduseremarklintnomissingblanklines-options)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks missing blank lines.

## When should I use this?

You can use this package to check blank lines.

## Presets

This plugin is not included in presets maintained here.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-no-missing-blank-lines
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintNoMissingBlankLines from 'https://esm.sh/remark-lint-no-missing-blank-lines@3'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintNoMissingBlankLines from 'https://esm.sh/remark-lint-no-missing-blank-lines@3?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintNoMissingBlankLines from 'remark-lint-no-missing-blank-lines'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintNoMissingBlankLines)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-no-missing-blank-lines .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-no-missing-blank-lines",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports the [TypeScript][typescript] type
[`Options`][api-options].
The default export is
[`remarkLintNoMissingBlankLines`][api-remark-lint-no-missing-blank-lines].

### `unified().use(remarkLintNoMissingBlankLines[, options])`

Warn when blank lines are missing.

###### Parameters

* `options` ([`Options`][api-options], optional)
  — configuration

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Options`

Configuration (TypeScript type).

###### Fields

* `exceptTightLists` (`boolean`, default: `false`)
  — allow omitting blank lines in list items

## Recommendation

Blank lines are required in certain sometimes confusing cases.
So it’s recommended to always use blank lines between blocks.

## Fix

[`remark-stringify`][github-remark-stringify] always uses blank lines
between blocks.
It has a `join` function to customize such behavior.

## Examples

##### `ok.md`

###### In

```markdown
# Mercury

## Venus

* Earth.

  * Mars.

> # Jupiter
>
> Saturn.
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
# Mercury
## Venus

* Earth
  * Mars.

> # Jupiter
> Saturn.
```

###### Out

```text
2:1-2:9: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
5:3-5:10: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
8:3-8:10: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
```

##### `tight.md`

When configured with `{ exceptTightLists: true }`.

###### In

```markdown
* Venus.

  * Mars.
```

###### Out

No messages.

##### `containers.md`

###### In

```markdown
> # Venus
>
> Mercury.

- earth.
- mars.

* # Jupiter
  Saturn.
```

###### Out

```text
9:3-9:10: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
```

##### `gfm.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| Planet  | Diameter |
| ------- | -------- |
| Mercury | 4 880 km |

[^Mercury]:
    **Mercury** is the first planet from the Sun and the smallest
    in the Solar System.
[^Venus]:
    **Venus** is the second planet from the Sun.
```

###### Out

```text
8:1-9:49: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
```

##### `mdx.mdx`

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
<Tip kind="info">
  # Venus
  Mars.
</Tip>
{Math.PI}
```

###### Out

```text
3:3-3:8: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
5:1-5:10: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
```

##### `math.md`

###### In

> 👉 **Note**: this example uses
> math ([`remark-math`][github-remark-math]).

```markdown
$$
\frac{1}{2}
$$
$$
\frac{2}{3}
$$
```

###### Out

```text
4:1-6:3: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
```

##### `directive.md`

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
Directives are also checked.

::video{#mercury}
:::planet
Venus.
:::
```

###### Out

```text
4:1-6:4: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-no-missing-blank-lines@3`,
compatible with Node.js 12.

## Contribute

See [`contributing.md`][github-dotfiles-contributing] in [`remarkjs/.github`][github-dotfiles-health] for ways
to get started.
See [`support.md`][github-dotfiles-support] for ways to get help.

This project has a [code of conduct][github-dotfiles-coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][file-license] © [Titus Wormer][author]

[api-options]: #options

[api-remark-lint-no-missing-blank-lines]: #unifieduseremarklintnomissingblanklines-options

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-no-missing-blank-lines.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-no-missing-blank-lines

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-no-missing-blank-lines

[badge-size-url]: https://bundlejs.com/?q=remark-lint-no-missing-blank-lines

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-directive]: https://github.com/remarkjs/remark-directive

[github-remark-gfm]: https://github.com/remarkjs/remark-gfm

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-math]: https://github.com/remarkjs/remark-math

[github-remark-mdx]: https://mdxjs.com/packages/remark-mdx/

[github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org
