import { ICloud, getImages, getSharedAlbumData, getWebAssetUrls, enrichAssetWithUrl } from '../src';

// To run tests: TOKEN=X npm run test
// The token should correspond to a public album with at least 1 image in it
const TOKEN = process.env.TOKEN as string;

describe('ICloud album test', () => {
  describe('Token', () => {
    test('Token set', () => {
      expect(TOKEN).toBeTruthy();
    });

    test('Expect 404 error if token is invalid', async () => {
      let status = 200;
      try {
        await getImages(TOKEN + 'X');
      } catch (err) {
        status = err.response.status;
      }

      expect(status).toBe(404);
    });
  });

  describe('1.0', () => {
    test('Validate album data', async () => {
      const { metadata, photos } = await getImages(TOKEN);

      // The album should have at least 1 image
      expect(photos.length).toBeGreaterThan(0);

      const firstImage = photos[0];

      // Test library-added attributes
      expect(typeof metadata.streamName).toBe('string');
      expect(typeof metadata.locations).toBe('object');
      expect(typeof metadata.streamCtag).toBe('string');
      expect(typeof metadata.userFirstName).toBe('string');
      expect(typeof metadata.userLastName).toBe('string');
      expect(typeof metadata.itemsReturned).toBe('number');

      expect(typeof firstImage.derivatives).toBe('object');
      expect(typeof firstImage.height).toBe('number');
      expect(typeof firstImage.width).toBe('number');
      expect(typeof firstImage.dateCreated).toBe('object');
      expect(typeof firstImage.batchDateCreated).toBe('object');

      const firstDerivative = Object.values(firstImage.derivatives)[0];

      expect(typeof firstDerivative.url).toBe('string');
      expect(typeof firstDerivative.height).toBe('number');
      expect(typeof firstDerivative.width).toBe('number');
    }, 30000);
  });

  describe('2.0', () => {
    let cachedApiResponse: ICloud.ApiResponse;
    let cachedUrlResponse: Record<string, Record<string, string>> = {};

    test('Get shared album data', async () => {
      const data = await getSharedAlbumTestData();

      const firstAsset = data.photos[data.photoGuids[0]];

      expect(data.photoGuids.length).toBeGreaterThan(0);
      expect(Object.keys(data.photos).length).toBeGreaterThan(0);
      expect(Object.keys(data.photos).length).toEqual(data.photoGuids.length);

      expect(typeof firstAsset.derivatives).toBe('object');
      expect(typeof firstAsset.height).toBe('number');
      expect(typeof firstAsset.width).toBe('number');
      expect(typeof firstAsset.dateCreated).toBe('object');
      expect(typeof firstAsset.batchDateCreated).toBe('object');

      const firstDerivative = Object.values(firstAsset.derivatives)[0];

      expect(typeof firstDerivative.height).toBe('number');
      expect(typeof firstDerivative.width).toBe('number');
      expect(firstDerivative.url).toBeUndefined();
    });

    test('Get web asset urls', async () => {
      const data = await getSharedAlbumTestData();
      const firstAsset = data.photos[data.photoGuids[0]];
      const urls = await getTestWebAssetUrl(firstAsset.photoGuid);

      expect(typeof urls).toBe('object');
      expect(Object.keys(urls).length).toBeGreaterThanOrEqual(1);
      expect(Object.values(urls)[0]).toContain('https://');
      expect(typeof Object.keys(urls)[0]).toBe('string');

      // The derivative checksum should be included in the url response
      const firstDerivative = Object.values(firstAsset.derivatives)[0];
      expect(Object.keys(urls).includes(firstDerivative.checksum)).toBeTruthy();
    });

    test('Enrich web assets with urls', async () => {
      const data = await getSharedAlbumTestData();
      const firstAsset = data.photos[data.photoGuids[0]];
      const urls = await getTestWebAssetUrl(firstAsset.photoGuid);

      const enriched = enrichAssetWithUrl(urls)(firstAsset);

      const firstDerivative = Object.values(enriched.derivatives)[0];

      expect(firstDerivative.url).toContain('https://');
      expect(Object.values(urls).includes(firstDerivative.url!)).toBeTruthy();
    });

    async function getSharedAlbumTestData() {
      if (cachedApiResponse) {
        return cachedApiResponse;
      }

      cachedApiResponse = await getSharedAlbumData(TOKEN);

      return cachedApiResponse;
    }

    async function getTestWebAssetUrl(guid: string) {
      if (cachedUrlResponse[guid]) {
        return cachedUrlResponse[guid];
      }

      cachedUrlResponse[guid] = await getWebAssetUrls(TOKEN, [guid]);

      return cachedUrlResponse[guid];
    }
  });
});
