
const apiPrefix = 'https://api.spotify.com/v1';

export default async ({offset, limit, playlist_id, token,}) => {
    //const searchUrl = `${apiPrefix}/search?type=playlist&limit=${limit}&offset=${offset}&q=${encodeURIComponent(q)}`;
    const searchUrl = `${apiPrefix}/playlists/` + playlist_id + `/tracks?fields=items(track(id,name,album(images(url))))`;
    // console.log('starting search, searchURL is ' + searchUrl);
    const params = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const res = await fetch(searchUrl, params);
    const jsonObj = await res.json();
    // console.log ('the json results returned is \n' + jsonObj );
    
    if (!res.ok){
        return [];
    }
    alert(JSON.stringify(jsonObj));
    const { items: {track } } = jsonObj;

    return track.map(item => ({
        id: item.id,
        title: item.name,
        imageUri: item.album.images
            ? item.album.images[0].url
            : undefined
    }));

};
