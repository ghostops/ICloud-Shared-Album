# ICloud Shared Album 📸

ICloud Shared Album is a library for scraping data off public icloud shared albums. Heavily utilization of [bertrandom/icloud-shared-album-to-flickr](https://github.com/bertrandom/icloud-shared-album-to-flickr), thanks for the great starting point!

### Breaking changes in v1.0.0

The `bestDerivative` and `url` variables have been removed. Instead the variable `url` has been added to the `Derivative` object. The key to the derivative is the height of the image, just like in the response from ICloud.

Previously:

```typescript
{
  url: 'https://...',
  bestDerivative: {
    checksum: 'string',
    fileSize: 'number',
    width: 'number',
    height: 'number',
  }
}
```

Now:

```typescript
{
  derivatives: {
    '100': {
      checksum: 'string',
      fileSize: 1000,
      width: 50,
      height: 100,
      url: 'https://...',
    },
    '1234': {
      checksum: 'string',
      fileSize: 5000,
      width: 500,
      height: 1234,
      url: 'https://...',
    }
  }
}
```

## Installation

Use npm or yarn to install the package:

```bash
yarn add icloud-shared-album
# or
npm install -s icloud-shared-album
```

## Usage

Apple uses CORS protection for the iCloud library API endpoints. Recommended use is server-side to avoid any CORS related errors.

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

### CLI Usage

The CLI will output the data in JSON if successful.

```
npx icloud-shared-album $TOKEN
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
