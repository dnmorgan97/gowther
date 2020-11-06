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

const AlbumsHorizontal = ({ data, heading, navigation, tagline }) => (
  <View style={styles.container}>
    {heading && <Text style={styles.heading}>{heading}</Text>}
    {tagline && <Text style={styles.tagline}>{tagline}</Text>}

    <FlatList
      contentContainerStyle={styles.containerContent}
      data={data}
      horizontal
      keyExtractor={({ id }) => id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={gStyle.activeOpacity}
          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
          onPress={() =>navigation.navigate('Album', { playlist: item })}
          style={styles.item}
        >
          <View style={styles.image}>
            <Image source={{ uri: item.images[0].url}} style={{width: 148, height: 148}}  />
          </View>
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
      )}
      showsHorizontalScrollIndicator={false}
    />
  </View>
);

AlbumsHorizontal.defaultProps = {
  heading: null,
  tagline: null
};

AlbumsHorizontal.propTypes = {
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

export default withNavigation(AlbumsHorizontal);
