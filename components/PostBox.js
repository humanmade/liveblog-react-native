import React from 'react'
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Keyboard, Image } from 'react-native'
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import Camera from 'react-native-camera'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class PostBox extends React.Component {
	constructor() {
		super()

		this.state = {
			text: '',
			isSaving: false,
			isFocusedText: false,
			tab: 'text',
			stagedImage: null,
			activeTab: 0,
		}
	}

	componentWillMount () {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this))
	}

	keyboardDidShow(e) {
		this.setState({keyboardHeight:e.endCoordinates.height})
	}

	componentWillUnmount () {
		this.keyboardDidShowListener.remove()
		this.keyboardDidHideListener.remove()
	}

	onCreatePost(status) {
		this.setState({isSaving:true})
		let post = {
			content: this.state.text,
			title: this.state.text.replace(/^(.{50}[^\s]*).*/, "$1"),
			status: status,
			format: 'status',
		}
		window.apiHandler.post('/wp/v2/posts', post)
			.then(data => {
				this.props.onDidPublish(data)
				this.setState({ isSaving: false, text: '' })
			})
	}

	onUploadImage() {
		this.setState({stagedImage:null})
	}

	onCaptureCamera() {
		this.camera.capture()
			.then((data) => {
				console.log(data)
				this.setState({stagedImage: data.path})
			})
			.catch(err => console.error(err));
	}

	render() {
		return <View
				style={[{
					marginBottom: this.state.isFocusedText ? this.state.keyboardHeight : 0,
					height: this.activeTab === 0 && ! this.state.isFocusedText ? 50 : 240,
				},styles.container]}
			>
				<ScrollableTabView
					renderTabBar={() => <TabBar />}
					contentProps={{keyboardShouldPersistTaps:false}}
					onChangeTab={e => {
						this.setState({isFocusedText:false, activeTab: e.i})
						dismissKeyboard()
					}}
				>
				<View>
					<TextInput
						key="text"
						keyboardAppearance="light"
						placeholder="What's happening?"
						placeholderTextColor="rgba(0,0,0,.4)"
						multiline={true}
						style={styles.textInput}
						tabLabel="text"
						value={this.state.text}
						onBlur={() => this.setState({isFocusedText: false})}
						onChangeText={ text => this.setState({text})}
						onFocus={() => this.setState({isFocusedText: true})}
					/>
					{this.state.text && ! this.state.isSaving ?
						<TouchableOpacity onPress={() => this.onCreatePost('publish')} style={styles.publish}>
							<Text style={styles.publishText}>Publish</Text>
						</TouchableOpacity>
					: null}
					{this.state.isSaving ?
						<Text>Publishing...</Text>
					: null}
				</View>
				<View>
					{this.state.stagedImage ?
						<View style={styles.imageWrapper}>
							<Image
								style={styles.previewImage}
								source={{uri:this.state.stagedImage}}
							/>
							<TouchableOpacity style={styles.uploadImage} onPress={() => this.onUploadImage()}>
								<View style={styles.cameraInner}>
									<Text style={styles.uploadImageText}>Publish</Text>
								</View>
							</TouchableOpacity>
						</View>
					:
						<Camera
							key="camera"
							tabLabel="camera"
							captureAudio={false}
							ref={(cam) => {
								this.camera = cam;
							}}
							style={styles.preview}
							aspect={Camera.constants.Aspect.fill}
							captureTarget={Camera.constants.CaptureTarget.temp}
						>
							<TouchableOpacity style={styles.camera} onPress={() => this.onCaptureCamera()}>
								<View style={styles.cameraInner} />
							</TouchableOpacity>
						</Camera>
					}
				</View>

			</ScrollableTabView>
		</View>
	}
}

PostBox.propTypes = {
	onDidPublish: React.PropTypes.func.isRequired,
}

class TabBar extends React.Component {
	render() {
		return <View style={styles.tabBar}>
			<TouchableOpacity
				onPress={() => this.props.goToPage(0)}
				style={styles.tabBarIcon}
			>
				<Icon name="text-height" size={24} color={this.props.activeTab === 0 ? '#000000' : 'rgba(0,0,0,.4)'} />
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => this.props.goToPage(1)}
				style={styles.tabBarIcon}
			>
				<Icon name="camera-retro" size={24} color={this.props.activeTab === 1 ? '#000000' : 'rgba(0,0,0,.4)'} />
			</TouchableOpacity>
		</View>
	}
}

class InvertedScrollView extends React.Component {
	return
}

const styles = StyleSheet.create({
	container: {
		borderTopWidth: 1,
		borderTopColor: 'rgba(150,150,150,0.25)',
	},
	publish: {
		height: 30,
		width: 100,
		borderRadius: 15,
		backgroundColor: '#EF642B',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'flex-end',
		marginRight: 20,
	},
	publishText: {
		color: '#FFFFFF',
		fontSize: 14,
	},
	textInput: {
		height: 160,
		fontSize: 20,
		color: 'black',
		padding: 10,
	},
	preview: {
		height: 210,
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	previewImage: {
		height: 210,
	},
	camera: {
		width: 70,
		height: 70,
		borderRadius: 35,
		borderWidth: 4,
		borderColor: '#FFFFFF',
		marginBottom: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cameraInner: {
		width: 58,
		height: 58,
		borderRadius: 29,
		backgroundColor: '#FFFFFF',
		justifyContent: 'center',
		alignItems: 'center',
	},
	tabBar: {
		flexDirection: 'row',
	},
	tabBarIcon: {
		padding: 5,
		paddingRight: 10,
		paddingLeft: 10,
	},
	uploadImage: {
		marginTop: -90,
		width: 70,
		height: 70,
		borderRadius: 35,
		borderWidth: 4,
		borderColor: '#FFFFFF',
		marginBottom: 20,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
	},
	uploadImageText: {
		color: '#000000'
	},
})
