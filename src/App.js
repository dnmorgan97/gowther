

import * as React from 'react';
import { StatusBar } from 'react-native';
import { AppLoading, registerRootComponent, AuthSession } from 'expo';
import { func } from './constants';



// main navigation stack
import Stack from './navigation/Stack';

class App extends React.Component {
  
  constructor() {
    super();
    //get last song from user preference

    this.state = {
      currentSongData: {
        album: '',
        artist: '',
        image: '',
        length: 0,
        title: ''
      },
      isLoading: true,
      toggleTabBar: false
    };

    this.changeSong = this.changeSong.bind(this);
    this.setToggleTabBar = this.setToggleTabBar.bind(this);
  }

  setToggleTabBar() {
    this.setState(({ toggleTabBar }) => ({
      toggleTabBar: !toggleTabBar
    }));
  }

  changeSong(data) {
    this.setState({
      currentSongData: data
    });
  }

  render() {
    const { currentSongData, isLoading, toggleTabBar } = this.state;

    if (isLoading) {
      return (
        <AppLoading
          onFinish={() => this.setState({ isLoading: false })}
          startAsync={func.loadAssetsAsync}
        />
      );
    }

    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />

        <Stack
          screenProps={{
            currentSongData,
            changeSong: this.changeSong,
            setToggleTabBar: this.setToggleTabBar,
            toggleTabBarState: toggleTabBar
          }}
        />
      </React.Fragment>
    );
  }
}

registerRootComponent(App);
