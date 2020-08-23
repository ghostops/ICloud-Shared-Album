import { ICloud } from './types';
import * as _chunk from 'lodash.chunk';
import axios from 'axios';

export * from './types';

const IS_CLI = require.main === module;

const getBaseUrl = (token: string): string => {
    const BASE_62_CHAR_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    const base62ToInt = (e: string): number => {
        let t = 0;
        for (let n = 0; n < e.length; n++) {
            t = t * 62 + BASE_62_CHAR_SET.indexOf(e[n]);
        }
        return t;
    };

    const e = token;
    const t = e[0];
    const n = t === "A" ? base62ToInt(e[1]) : base62ToInt(e.substring(1, 3));
    const i = e.indexOf(";");
    let r = e;
    let s = null;

    if (i >= 0) {
        s = e.slice(i + 1);
        r = r.replace(";" + s, "");      
    }

    const serverPartition = n;

    let baseUrl = 'https://p';

    baseUrl += (serverPartition < 10) ? "0" + serverPartition : serverPartition;
    baseUrl += '-sharedstreams.icloud.com';
    baseUrl += '/';
    baseUrl += token;
    baseUrl += '/sharedstreams/'

    return baseUrl;
}

const getPhotoMetadata = async (baseUrl): Promise<ICloud.Metadata> => {
    const url = baseUrl + 'webstream';

    const headers = {
        'Origin': 'https://www.icloud.com',
        'Accept-Language': 'en-US,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
        'Content-Type': 'text/plain',
        'Accept': '*/*',
        'Referer': 'https://www.icloud.com/sharedalbum/',
        'Connection': 'keep-alive'
    };

    const dataString = '{"streamCtag":null}';

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

const getUrls = async (baseUrl, photoGuids): Promise<Record<string, string>> => {
    const url = baseUrl + 'webasseturls';

    const headers = {
        'Origin': 'https://www.icloud.com',
        'Accept-Language': 'en-US,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
        'Content-Type': 'text/plain',
        'Accept': '*/*',
        'Referer': 'https://www.icloud.com/sharedalbum/',
        'Connection': 'keep-alive'
    };

    const dataString = JSON.stringify({
        photoGuids: photoGuids
    });

    if (IS_CLI) {
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

const getParsedImages = (metadata: ICloud.Metadata, urls: Record<string, string>): ICloud.ImageWithUrl[] => {
    const urlMap: Record<string, ICloud.UrlDerivative> = {};

    for (const photoId in metadata.photos) {
        const photo = metadata.photos[photoId];

        let biggestFileSize = 0;
        let bestDerivative = null;

        for (const derivativeId in photo.derivatives) {
            const derivative = photo.derivatives[derivativeId];

            if (parseInt(derivative.fileSize, 10) > biggestFileSize) {
                biggestFileSize = parseInt(derivative.fileSize, 10);
                bestDerivative = derivative;
            }
        }

        if (bestDerivative) {
            if (typeof urls[bestDerivative.checksum] == 'undefined') {
                continue;
            }

            const url = urls[bestDerivative.checksum];

            if (!urlMap[photoId]) {
                urlMap[photoId] = {
                    bestDerivative,
                    url,
                };
            }
        }
    }

    const withUrls = Object.keys(metadata.photos).map((key) => ({
        ...metadata.photos[key],
        ...urlMap[key]
    }));

    return withUrls;
}

export const getImages = async (token: string): Promise<ICloud.ImageWithUrl[]> => {
    const baseUrl = getBaseUrl(token);

    const metadata = await getPhotoMetadata(baseUrl);

    const chunks = _chunk(metadata.photoGuids, 25);
    
    let urls: Record<string, string> = {};

    for (const chunk of chunks) {
        const _urls = await getUrls(baseUrl, chunk);
        urls = {
            ...urls,
            ..._urls,
        };
    }

    return getParsedImages(metadata, urls);
}

// Can be used as CLI
if (IS_CLI) {
    const token = process.argv.slice(2)[0];

    if (!token) {
        throw new Error('Must provide a token as the first argument.');
    }
    
    getImages(token).then(console.log);
}
