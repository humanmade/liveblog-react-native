import React from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import Post from './Post'

export default class PostsList extends React.Component {
	render() {
		let posts = this.props.posts

		return <ScrollView style={styles.container}>
			{posts.map( post =>
				<Post
					key={post.id}
					post={post}
					user={this.props.user}
					onApprovePost={this.props.onApprovePost}
					onRejectPost={this.props.onRejectPost}
					onLikePost={this.props.onLikePost}
				/>
			)}
		</ScrollView>
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 15,
		flex: 1,
	},
})
