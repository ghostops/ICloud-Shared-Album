import { getImages } from '../src';

// To run tests: TOKEN=X yarn test OR yarn cross-env TOKEN=X yarn test
// The token should correspond to a public album with at least 1 image in it
const TOKEN = process.env.TOKEN as string;

describe('ICloud album test', () => {
  test('Token set', () => {
    expect(TOKEN).toBeTruthy();
  });

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
