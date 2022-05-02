import path from 'node:path'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import test from 'ava'
import posthtml from 'posthtml'
import highlight from '../index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fixture = file => readFileSync(path.join(__dirname, 'fixtures', `${file}.html`), 'utf8')
const expected = file => readFileSync(path.join(__dirname, 'expected', `${file}.html`), 'utf8')

const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const process = (t, name, options, log = false) => {
  return posthtml([highlight(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => t.is(html, expected(name).trim()))
}

test('Highlights <code> tags inside <pre> tags', t => {
  return process(t, 'basic')
})

test('Highlights inline <code> tags', t => {
  return process(t, 'inline_code', {inline: true})
})

test('Ignores <code> blocks with prism-ignore attribute', t => {
  return process(t, 'prism_ignore_attr')
})

test('Ignores <code> blocks with prism-ignore class', t => {
  return process(t, 'prism_ignore_class')
})

test('Highlights block with one of the default languages specified', t => {
  return process(t, 'custom_language_default')
})

test('Loads custom language and highlights block', t => {
  return process(t, 'custom_language_load')
})

test('Preserves existing classes', t => {
  return process(t, 'preserves_classes')
})

test('Throws error when using an invalid language in class name', async t => {
  await t.throwsAsync(async () => {
    await process(t, 'invalid_language')
  }, {instanceOf: Error})
})
