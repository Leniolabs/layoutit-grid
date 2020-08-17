import Prism from 'prismjs'

export function highlight(code, type) {
  switch (type) {
    case 'html':
      return Prism.highlight(code, Prism.languages.html, 'html')
    case 'css':
      return Prism.highlight(code, Prism.languages.css, 'css')
    default:
      return code
  }
}
