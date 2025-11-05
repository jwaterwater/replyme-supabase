"use client";

import React, { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../../../components/themed-text';
import { ThemedView } from '../../../components/themed-view';
import { Button, ButtonText } from '../../../components/ui/button';

export default function LoginTestPage() {
	const [open, setOpen] = useState(false);

	function onChoose(option: string) {
		// For demo purposes just alert the chosen option.
		// Replace with real login flows (mobile/email/apple) as needed.
		// Use global toast/overlay providers if you want nicer UI.
		// Using alert for simplicity.
		// eslint-disable-next-line no-alert
		alert(`Chosen login: ${option}`);
		setOpen(false);
	}

	return (
		<ThemedView style={styles.container}>
			<View style={styles.top}>
				<Image
					source={require('../../../assets/images/react-logo.png')}
					style={styles.image}
					resizeMode="contain"
				/>
			</View>

			<View style={styles.bottom}>
						<Button size="lg" onPress={() => setOpen(true)} style={styles.loginButton}>
							<ButtonText>Login</ButtonText>
						</Button>
			</View>

			<Modal
				visible={open}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setOpen(false)}
			>
				<Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
					<View style={styles.modalContent}>
						<ThemedText type="title" style={styles.modalTitle}>
							Choose login method
						</ThemedText>

						<View style={styles.optionList}>
											<Button onPress={() => onChoose('Mobile')} style={styles.optionButton}>
												<ButtonText>Login with Mobile</ButtonText>
											</Button>

											<Button onPress={() => onChoose('Email')} variant="outline" style={styles.optionButton}>
												<ButtonText>Login with Email</ButtonText>
											</Button>

											<Button onPress={() => onChoose('Apple')} variant="outline" style={styles.optionButton}>
												<ButtonText>Login with Apple</ButtonText>
											</Button>

											<Button onPress={() => onChoose('Other')} variant="outline" style={styles.optionButton}>
												<ButtonText>Other</ButtonText>
											</Button>
						</View>
					</View>
				</Pressable>
			</Modal>
		</ThemedView>
	);
}

// Set a custom header title for this route (Expo Router will use this in the native header)
export const options = {
	title: '登录',
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	top: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
	},
	image: {
		width: '80%',
		height: '60%',
	},
	bottom: {
		padding: 24,
		paddingBottom: 40,
	},
	loginButton: {
		width: '100%',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'flex-end',
	},
	modalContent: {
		backgroundColor: 'white',
		padding: 20,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	modalTitle: {
		marginBottom: 12,
	},
	optionList: {
		gap: 10,
	},
	optionButton: {
		width: '100%',
	},
});

