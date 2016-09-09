import React from 'react'
import { View, StyleSheet, Text, TextInput, Image, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import SafariView from 'react-native-safari-view'
import api from 'wordpress-rest-api-oauth-1'
import querystring from 'query-string'

const API_KEY = 'Q0656hGR6jAz'
const API_SECRET = '5pbC3e60cMwyITtkOZKexHofkdJ6QkPJeQNJDwlQOfNopQUh'
const CALLBACK_URL = 'liveblog://oauth_callback'

export default class Welcome extends React.Component {
	constructor() {
		super()
		this.state = {
			url: '',
			isConnecting: false,
			connectingStatus: '',
			lastError: null,
		}
	}
	onChange(text) {
		this.setState({
			url: text,
			lastError: null,
		})
	}
	onConnect() {
		this.setState({ isConnecting: true, lastError: null })
		window.apiHandler = new api({
			url: this.state.url,
			brokerCredentials: {
				client: {
					public: API_KEY,
					secret: API_SECRET,
				},
			},
			callbackURL: CALLBACK_URL,
		})

		this.onLogin()
	}
	onLogin() {
		this.setState({ connectingStatus: 'Getting consumer token.' })
		window.apiHandler.getConsumerToken()
			.then( () => {
				this.setState({ connectingStatus: 'Getting request token.' })
				return window.apiHandler.getRequestToken()
			} )
			.then( requestToken => {
				console.log(requestToken)
				this.setState({ connectingStatus: 'Asking user to authorise.' })
				SafariView.show({
					url: requestToken.redirectURL,
					tintColor: '#ED5A24',
				})
				Linking.addEventListener( 'url', oauthCallback )
			} )
			.catch( lastError => this.setState({ lastError, isConnecting: false }) )

			var oauthCallback = event => {
				SafariView.dismiss()
				Linking.removeEventListener( 'url', oauthCallback )
				var args = querystring.parse( event.url.split('?')[1] )
				console.log(args)
				window.apiHandler.config.credentials.token.public = args.oauth_token
				console.log(args)
				this.setState({ connectingStatus: 'Getting access token.' })
				window.apiHandler.getAccessToken( args.oauth_verifier )
					.then( () => {
						this.props.onConnect(this.state.url)
					})
			}
	}
	render() {
		return <View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image style={styles.image} source={require('../images/logo.png')} />
			</View>
			<TextInput
				autoCapitalize="none"
				autoCorrect={false}
				defaultValue="http://wordpress.dev/"
				keyboardType="url"
				placeholder="Your site URL"
				returnKeyType="go"
				style={styles.input}
				value={this.state.url}
				onChangeText={text => this.onChange(text)}
				onSubmitEditing={() => this.onConnect(this.state.url)}
			/>

			{this.state.isConnecting ?
				<View style={styles.status}>
					<ActivityIndicator color="#FFFFFF" />
					<Text style={styles.statusText}>{this.state.connectingStatus}</Text>
				</View>
			: null}

			{this.state.lastError ?
				<Text style={styles.lastError}>{this.state.lastError.message}</Text>
			: null }
		</View>
	}
}
Welcome.propTypes = {
	onConnect: React.PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#3B4049',
		flexDirection: 'column',
		flex: 1,
		alignItems: 'stretch',

	},
	imageContainer: {
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 80,
		paddingBottom: 80,
	},
	image: {
		height: 70,
		resizeMode: 'contain',
	},
	input: {
		height: 40,
		padding: 10,
		margin: 20,
		backgroundColor: '#F6F6F6',
		borderWidth: 1,
		borderRadius: 2,
		borderColor: '#E3E3E3',
		marginTop: 80,
		marginBottom: 80,
	},
	button: {
		height: 60,
		width: 200,
		borderRadius: 30,
		backgroundColor: '#EF642B',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 16,
	},
	status: {
		justifyContent: 'center',
		flexDirection: 'row',
	},
	statusText: {
		color: '#FFFFFF',
		marginLeft: 5,
	},
	lastError: {
		color: '#FFFFFF',
		textAlign: 'center',
		marginTop: 15,
	},
})
