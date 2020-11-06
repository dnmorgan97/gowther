import * as React from 'react';

import { Animated, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { colors, device, gStyle } from '../constants';


// components
import AlbumsHorizontal from '../components/AlbumsHorizontal';
import FeedHorizontal from '../components/FeedHorizontal';
import DjsHorizontal from '../components/DjsHorizontal';

// mock data
import tweets from '../mockdata/tweets.json';
import DjsApi from '../api/DjsApi'
import SpotifyApi from '../api/SpotifyApi'
import InstagramApi from '../api/InstagramApi'

class Home extends React.Component {
  spotifyApi = null;
  feedApi = null;

  constructor(props) {
    super(props);
    this.spotifyApi = new SpotifyApi();
    this.feedApi = new InstagramApi();

    this.state = {
      scrollY: new Animated.Value(0),
      userData: [],
      user: null,
      djs: [],
      playlists: []
    };
  }


  async componentDidMount() {

    const tokenExpirationTime = await this.spotifyApi.getUserData('expirationTime');

    if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
      await this.spotifyApi.getTokens();
      //await this.feedApi.getTokens();
    } else {
      this.setState({ accessTokenAvailable: true });
    }

    var me = await this.spotifyApi.getMe();
    this.state.djs.push(me);
    this.state.me = me;

    var playists = await this.spotifyApi.getMyPlaylists();
    this.state.playlists = playists;

    //var feeds = this.InstagramApi.login();
    //alert(feeds);

    this.setState({
      "me": me,
      "djs": this.state.djs,
      "playlists": this.state.playlists
    });
  }

  render() {
    const { scrollY } = this.state;

    const opacityIn = scrollY.interpolate({
      inputRange: [0, 128],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });

    const opacityOut = scrollY.interpolate({
      inputRange: [0, 88],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });

    return (
      (this.state.djs.length !==0 &&(
      <React.Fragment>
        {device.iPhoneX && (
          <Animated.View style={[styles.iPhoneNotch, { opacity: opacityIn }]} />
        )}

        <Animated.View
          style={[styles.containerHeader, { opacity: opacityOut }]}
        >
          <FontAwesome color={colors.white} name="cog" size={28} />
        </Animated.View>

        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={gStyle.container}
        >
          <View style={gStyle.spacer16} />
          
          <DjsHorizontal data={this.state.djs} heading="Internet DJ" />
          <AlbumsHorizontal data={this.state.playlists.items} heading="Playlists" />
          <FeedHorizontal data={tweets} heading="Feed" />
          
        </Animated.ScrollView>
      </React.Fragment>))
    );
  }
}

const styles = StyleSheet.create({
  iPhoneNotch: {
    backgroundColor: colors.black70,
    height: 44,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 20
  },
  containerHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: device.iPhoneX ? 60 : 36,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10
  }
});

export default Home;
