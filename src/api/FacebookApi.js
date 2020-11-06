class FacebookApi {
    clientToken = "de56d5ad4fd8c7b9c948c4fe22f3185b";
    appID = '1834815726668453';

    logIn() {
        
    
        try {
        const {
            type,
            token, // <- this is your access token
            expires,
            permissions,
            declinedPermissions,
        } = await Expo.Facebook.logInWithReadPermissionsAsync(appID, { permissions: ['public_profile', 'email'], });
    
        if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            const response = await fetch(`https://graph.facebook.com/me/?fields=id,name&access_token=${token}`); //<- use the token you got in your request
            const userInfo = await response.json();
            alert(userInfo.name);
    
            // you could now save the token in AsyncStorage, Redux or leave it in state
            await AsyncStorage.setItem('token', token); // <- save the token in AsyncStorage for later use
        } else {
            // type === 'cancel'
        }
    
        } catch ({ message }) {
        alert(`Facebook Login Error: ${message}`);
        }
    }
}

export default FacebookApi;