<!--This file is generated-->

# remark-lint-strikethrough-marker

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when the number of GFM strikethrough markers are
inconsistent.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintStrikethroughMarker[, options])`](#unifieduseremarklintstrikethroughmarker-options)
  * [`Marker`](#marker)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the number of strikethrough markers.
Strikethrough is a GFM feature enabled with
[`remark-gfm`][github-remark-gfm].

## When should I use this?

You can use this package to check that GFM strikethrough is consistent.

## Presets

This plugin is not included in presets maintained here.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-strikethrough-marker
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintStrikethroughMarker from 'https://esm.sh/remark-lint-strikethrough-marker@2'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintStrikethroughMarker from 'https://esm.sh/remark-lint-strikethrough-marker@2?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintStrikethroughMarker from 'remark-lint-strikethrough-marker'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintStrikethroughMarker)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-strikethrough-marker .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-strikethrough-marker",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports the [TypeScript][typescript] types
[`Marker`][api-marker] and
[`Options`][api-options].
The default export is
[`remarkLintStrikethroughMarker`][api-remark-lint-strikethrough-marker].

### `unified().use(remarkLintStrikethroughMarker[, options])`

Warn when the number of GFM strikethrough markers are inconsistent.

###### Parameters

* `options` ([`Options`][api-options], default: `'consistent'`)
  — preferred style or whether to detect the first style and warn for
  further differences

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Marker`

Marker (TypeScript type).

###### Type

```ts
type Marker = '~~' | '~'
```

### `Options`

Configuration (TypeScript type).

###### Type

```ts
type Options = Marker | 'consistent'
```

## Recommendation

GitHub flavored markdown (GFM) specifies that two tildes should be used,
but `github.com` allows one tilde everywhere.
It’s recommended to use two tildes.

## Fix

[`remark-stringify`][github-remark-stringify] with
[`remark-gfm`][github-remark-gfm] formats all strikethrough with two tildes.

## Examples

##### `not-ok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
~Mercury~Venus and ~~Earth~~Mars.
```

###### Out

```text
1:20-1:29: Unexpected double tilde strikethrough sequences (`~~`), expected single tilde (`~`)
```

##### `ok.md`

When configured with `'~'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
~Mercury~Venus.
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'~'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
~~Mercury~~Venus.
```

###### Out

```text
1:1-1:12: Unexpected double tilde strikethrough sequences (`~~`), expected single tilde (`~`)
```

##### `ok.md`

When configured with `'~~'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
~~Mercury~~Venus.
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'~~'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
~Mercury~Venus.
```

###### Out

```text
1:1-1:10: Unexpected single tilde strikethrough sequences (`~`), expected double tilde (`~~`)
```

##### `not-ok.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected `'~~'`, `'~'`, or `'consistent'`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-strikethrough-marker@2`,
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

[api-marker]: #marker

[api-options]: #options

[api-remark-lint-strikethrough-marker]: #unifieduseremarklintstrikethroughmarker-options

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-strikethrough-marker.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-strikethrough-marker

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-strikethrough-marker

[badge-size-url]: https://bundlejs.com/?q=remark-lint-strikethrough-marker

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-gfm]: https://github.com/remarkjs/remark-gfm

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org
