'use strict';

const Prism = require('prismjs');
const render = require('posthtml-render');
const loadLanguages = require('prismjs/components/');

function createPrismPlugin(options) {
  return function (tree) {
    const highlightCodeTags = node => tree.match.call(node, {tag: 'code'}, highlightNode);

    if (options.inline) {
      highlightCodeTags(tree);
    } else {
      tree.match({tag: 'pre'}, highlightCodeTags);
    }
  };
}

function highlightNode(node) {
  const attrs = node.attrs || {};
  const classList = `${attrs.class || ''}`.trimStart();

  if ('prism-ignore' in attrs) {
    delete node.attrs['prism-ignore'];
    return node;
  }

  if (classList.includes('prism-ignore')) {
    node.attrs.class = node.attrs.class.replace('prism-ignore', '').trim();
    return node;
  }

  const lang = getExplicitLanguage(classList);

  if (lang && !classList.includes(`language-${lang}`)) {
    attrs.class = `${classList || ''} language-${lang}`.trimStart();
  }

  node.attrs = attrs;

  if (node.content) {
    const html = (node.content[0].tag && !node.content[0].content) ? `<${node.content[0].tag}>` : render(node.content);

    node.content = mapStringOrNode(html, lang);
  }

  return node;
}

function mapStringOrNode(stringOrNode, lang = null) {
  if (typeof stringOrNode === 'string') {
    if (lang) {
      if (!Object.keys(Prism.languages).includes(lang)) {
        loadLanguages.silent = true;
        loadLanguages([lang]);
      }

      return Prism.highlight(stringOrNode, Prism.languages[lang], lang);
    }

    return Prism.highlight(stringOrNode, Prism.languages.markup, 'markup');
  }

  highlightNode(stringOrNode);
  return stringOrNode;
}

function getExplicitLanguage(classList) {
  const matches = classList.match(/(?:lang|language)-(\w*)/);
  return matches === null ? null : matches[1];
}

module.exports = options => {
  options = options || {};
  options.inline = options.inline || false;

  return function (tree) {
    return createPrismPlugin(options)(tree);
  };
};
