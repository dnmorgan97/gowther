import * as React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { colors, gStyle, images } from '../constants';

//CHCKj0mnYiC
const FeedHorizontal = ({ data, heading, navigation, tagline }) => (
  <View style={styles.container}>
    {heading && <Text style={styles.heading}>{heading}</Text>}
    {tagline && <Text style={styles.tagline}>{tagline}</Text>}

    <FlatList
      contentContainerStyle={styles.containerContent}
      data={data}
      horizontal
      keyExtractor={({ id }) => id.toString()}
      renderItem={({ item }) => (
        <View>
          
        </View>
      )}
      showsHorizontalScrollIndicator={false}
    />
  </View>
);

FeedHorizontal.defaultProps = {
  heading: null,
  tagline: null
};

FeedHorizontal.propTypes = {
  // required
  data: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,

  // optional
  heading: PropTypes.string,
  tagline: PropTypes.string
};


const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    width: '100%'
  },
  containerContent: {
    paddingLeft: 16
  },
  heading: {
    ...gStyle.textSpotifyBold18,
    color: colors.white,
    paddingBottom: 6,
    textAlign: 'center'
  },
  tagline: {
    ...gStyle.textSpotify12,
    color: colors.greyInactive,
    paddingBottom: 6,
    textAlign: 'center'
  },
  item: {
    marginRight: 16,
    width: 148
  },
  image: {
    backgroundColor: colors.greyLight,
    height: 148,
    width: 148
  },
  title: {
    ...gStyle.textSpotifyBold12,
    color: colors.white,
    marginTop: 4,
    textAlign: 'center'
  }
});

export default withNavigation(FeedHorizontal);
