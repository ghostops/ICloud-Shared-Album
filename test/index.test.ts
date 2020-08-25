import { getImages } from '../src';

// To run tests: TOKEN=X yarn test OR yarn cross-env TOKEN=X yarn test
// The token should correspond to a public album with at least 1 image in it
const TOKEN = process.env.TOKEN;

describe('ICloud album test', () => {
    test('Validate album data', async () => {
        const album = await getImages(TOKEN);

        // The album should have at least 1 image
        expect(album.length).toBeGreaterThan(0);

        const firstImage = album[0];

        // Test library-added attributes
        expect(typeof firstImage.url).toBe('string');
        expect(typeof firstImage.bestDerivative).toBe('object');
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
