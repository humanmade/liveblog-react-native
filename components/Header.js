import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class Header extends React.Component {
	render() {
		return <View style={styles.container}>
			<Text style={styles.text}>Apple Keynote 2016</Text>
		</View>
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#ED5A24',
		height: 57,
		justifyContent: 'center',
		shadowColor: '#000000',
		shadowRadius: 3,
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.6,
		zIndex: 1,
	},
	text: {
		fontSize: 16,
		marginTop: 10,
		color: '#FFFFFF',
		textAlign: 'center',
	},
})
