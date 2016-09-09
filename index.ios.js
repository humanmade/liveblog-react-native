import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import App from './components/App'

class liveblog extends Component {
	render() {
		return <App />
	}
}

AppRegistry.registerComponent('liveblog', () => liveblog)
