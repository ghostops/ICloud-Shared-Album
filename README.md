# ICloud Shared Album 📸

ICloud Shared Album is a library for scraping data off public icloud shared albums. Heavily utilization of [bertrandom/icloud-shared-album-to-flickr](https://github.com/bertrandom/icloud-shared-album-to-flickr), thanks for the great starting point!

## Installation

Use npm or yarn to install the package:

```bash
yarn add icloud-shared-album
# or
npm install -s icloud-shared-album
```

## Usage

```js
import { getImages } from 'icloud-shared-album';

const data = await getImages('YOUR_ALBUM_TOKEN');

console.log(data);
```

You can obtain your ICloud album token from the public URL.

```
https://www.icloud.com/sharedalbum/#B0z5qAGN1JIFd3y
                                    ^^^^^^^^^^^^^^^
```

The string behind the hash will be your token.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
