import { ICloud } from './types';
import axios from 'axios';

// Keep these static
const headers = {
    'Origin': 'https://www.icloud.com',
    'Accept-Language': 'en-US,en;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
    'Content-Type': 'text/plain',
    'Accept': '*/*',
    'Referer': 'https://www.icloud.com/sharedalbum/',
    'Connection': 'keep-alive'
};

export const getPhotoMetadata = async (baseUrl: string): Promise<ICloud.Metadata> => {
    const url = baseUrl + 'webstream';

    const dataString = JSON.stringify({ streamCtag: null });

    const { data } = await axios({
        url,
        headers,
        data: dataString,
        method: 'POST',
    });

    const photos: Record<string, ICloud.Image> = {};
    const photoGuids: string[] = [];

    data.photos.forEach(function(photo) {
        photos[photo.photoGuid] = photo;
        photoGuids.push(photo.photoGuid);
    });

    return {
        photos,
        photoGuids,
    };
}

export const getUrls = async (baseUrl: string, photoGuids: string[]): Promise<Record<string, string>> => {
    const url = baseUrl + 'webasseturls';

    const dataString = JSON.stringify({
        photoGuids: photoGuids
    });

    if (require.main === module) {
        console.log('Retrieving URLs for ' + photoGuids[0] + ' - ' + photoGuids[photoGuids.length - 1] + '...');
    }

    const { data } = await axios({
        url,
        method: 'POST',
        headers,
        data: dataString,
    });

    const items = {};

    for (const itemId in data.items) {
        const item = data.items[itemId];

        items[itemId] = 'https://' + item.url_location + item.url_path;
    }

    return items;
}
