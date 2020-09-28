import Prism from 'prismjs'

const highlightTypes = {
  html: Prism.highlight(code, Prism.languages.html, 'html'),
  css: Prism.highlight(code, Prism.languages.css, 'css'),
}

export const highlight = (code, type) => highlightTypes[type] || code;
