import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import PostActions from './PostActions'

export default class Post extends React.Component {
	render() {
		let { post } = this.props
		let date = (new Date( post.date )).toISOString().split('T')[1].slice(0, 5)

		return <View style={styles.container}>
			<View style={styles.left}>
				<Text style={styles.date}>{date}</Text>
				<View style={styles.line} />
			</View>
			<View style={styles.right}>
				<Text>{post.content.raw}</Text>
				<View style={styles.user}>
					{post._embedded.author[0].avatar_urls ?
						<Image
							source={{uri:post._embedded.author[0].avatar_urls[48]}}
							style={styles.userImage}
						/>
					: null}
					<Text style={styles.userName}>{post._embedded.author[0].name}</Text>
				</View>
			</View>
		</View>
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
	},
	left: {
		flexDirection: 'column',
		alignItems: 'center',
		width: 33,
		marginRight: 15,
	},
	right: {
		flex: 1,
		flexDirection: 'column',
		borderBottomWidth: 1,
		borderBottomColor: '#DAD1C1',
		paddingBottom: 20,
		marginBottom: 10,
	},
	date: {
		color: '#464444',
		fontSize: 11,
		paddingTop: 3,
		paddingBottom: 5,
	},
	line: {
		width: 1,
		flex: 1,
		backgroundColor: '#DAD1C1',
	},
	user: {
		flexDirection: 'row',
		marginTop: 20,
		alignItems: 'center',
	},
	userImage: {
		borderRadius: 10,
		width: 20,
		height: 20,
		backgroundColor: '#CCCCCC',
		marginRight: 7,
	},
	userName: {
		color: '#464444',
		fontSize: 11,
		lineHeight: 11,
	},
})
