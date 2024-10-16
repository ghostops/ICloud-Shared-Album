// 2024 : Apple began issuing a 330 redirect, so we need to deal with that.
// With thanks to:
// https://github.com/bertrandom/icloud-shared-album-to-flickr/commit/badd91d53b96832213c9e156a31ad604aa740014#diff-e07d531ac040ce3f40e0ce632ac2a059d7cd60f20e61f78268ac3be015b3b28f
// Adapted by @jmaton : use axios instead of reqeust-promise-native; massage syntax to match this project (ICloud-Shared-Album)
import axios from 'axios';


export const getRedirectedBaseUrl = async (baseUrl: string, token: string) => {

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

    const response = await axios({
        url: url,
        method: 'POST',
        headers: headers,
        data: dataString,
        validateStatus: status => status < 400  // do not fail on 330
    });

    if (response.status == 330) {
        const body = response.data; // axios performs "automatic parsing" based on Content-Type header
        let newBaseUrl = 'https://';
        newBaseUrl += body["X-Apple-MMe-Host"]
        newBaseUrl += '/';
        newBaseUrl += token;
        newBaseUrl += '/sharedstreams/';

        return newBaseUrl;
    }

    return baseUrl;
}