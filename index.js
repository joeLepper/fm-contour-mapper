import jsnox from 'jsnox'
import react from 'react'

var d = jsnox(react)

class foo extends react.Component {
  render () { return d('div', {}, 'Hello, ' + this.props.name) }
}

window.addEventListener('load', (e) => {
  react.render(react.createElement(foo, { name: 'JS no X'}), document.querySelector('body'))
})
