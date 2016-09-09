import React from 'react'
import { View, StyleSheet } from 'react-native'
import Header from './Header'
import PostsList from './PostsList'
import PostBox from './PostBox'
import Welcome from './Welcome'
import posts from '../data'

export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			posts: [],
			isLoadingPosts: false,
			user: null,
			url: '',
		}

	}
	loadPosts() {
		this.setState({ isLoadingPosts: true })

		let args = {
			_embed: true,
			per_page: 10,
			context: 'edit',
			status: 'any',
		}

		apiHandler.get('/wp/v2/posts', args)
			.then(posts => {
				this.setState({ posts, isLoadingPosts: false })
			})
	}
	onConnect(url) {
		this.setState({ url })
		this.onLoggedIn()
	}
	onLikePost(post) {
		window.apiHandler.post( '/liveblog-likes/v1/posts/' + post.id + '/like' )
			.then( response => {
				this.setState({
					posts: this.state.posts.map( p => {
						p.id === post.id ? p.liveblog_likes = response.count : null
						return p
					} )
				})
			})
	}
	onLoggedIn() {
		window.apiHandler.get('/wp/v2/users/me', {_envelope: true, context: 'edit'})
			.then(data => data.body)
			.then(user => this.setState({ user }))
			.then(() => this.loadPosts() )
	}
	onLogout() {
		this.setState({ user:null })
		window.apiHandler.removeCredentials()
	}
	onApprovePost(post) {
		window.apiHandler.post( '/wp/v2/posts/' + post.id, { status : 'publish' } )
			.then( post => this.loadPosts() )
	}
	onRejectPost(post) {
		window.apiHandler.del( '/wp/v2/posts/' + post.id )
			.then( () => this.loadPosts() )
	}
	render() {
		if (!this.state.url) {
			return <Welcome onConnect={url => this.onConnect(url)} />
		}
		return <View style={styles.container}>
			<Header />
			<PostsList
				posts={this.state.posts}
			/>
			<PostBox
				onDidPublish={post => this.loadPosts()}
			/>
		</View>
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
