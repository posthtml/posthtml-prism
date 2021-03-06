# PostHTML Prism Plugin <img align="right" width="220" height="200" title="PostHTML logo" src="http://posthtml.github.io/posthtml/logo.svg">

[![Version][npm-version-shield]][npm]
[![License][mit-shield]][mit]
[![Build][github-ci-shield]][github-ci]
[![Downloads][npm-stats-shield]][npm-stats]

Compile-time syntax highlighting for code blocks with [Prism](https://prismjs.com/).

Before:

```html
<pre><code class="language-javascript">
  const foo = 'foo'
  console.log(foo)
</code></pre>
```

After:

```html
<pre><code class="language-javascript">
  <span class="token keyword">const</span> foo <span class="token operator">=</span> <span class="token string">'foo'</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>foo<span class="token punctuation">)</span>
</code></pre>
```

## Install

```
$ npm i posthtml posthtml-prism
```

## Usage

```js
const fs = require('fs')
const posthtml = require('posthtml')
const highlight = require('posthtml-prism')

const source = fs.readFileSync('./before.html')

posthtml([
    highlight({ inline: true  })
  ])
  .process(source)
  .then(result => fs.writeFileSync('./after.html', result.html))
```

## Options

### inline 

Type: `boolean`\
Default: `false`

By default, only `<code>` tags wrapped in `<pre>` tags are highlighted. 

Pass in `inline: true` to highlight all code tags.

## Styling

You will also need to include a Prism theme stylesheet in your HTML. 

See [PrismJS/prism-themes](https://github.com/PrismJS/prism-themes) for all available themes.

## Languages

By default, Prism loads the following languages: `markup`, `css`, `clike`, and `javascript`.

You can specify the language to be used for highlighting your code, by adding a `language-*` or `lang-*` class to the `<code>` tag:

```html
<pre>
  <code class="language-php">
    $app->post('framework/{id}', function($framework) {        
      $this->dispatch(new Energy($framework));
    });
  </code>
</pre>
```

### Skip highlighting on a node

You can skip highlighting on a node in two ways:

1. add a `prism-ignore` attribute on the node:
  ```html
  <pre>
    <code prism-ignore>...</code>
  </pre>
  ```

2. or, add a `prism-ignore` class:
  ```html
  <pre>
    <code class="prism-ignore">...</code>
  </pre>
  ```

In both cases, the `prism-ignore` attribute/class will be removed and highlighting will be skipped.

[npm]: https://www.npmjs.com/package/posthtml-prism
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-prism.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-prism&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-prism.svg?maxAge=2592000
[github-ci]: https://github.com/posthtml/posthtml-prism/actions
[github-ci-shield]: https://img.shields.io/github/workflow/status/posthtml/posthtml-prism/Node.js%20CI
[license]: ./license
[mit-shield]: https://img.shields.io/npm/l/posthtml-prism.svg
