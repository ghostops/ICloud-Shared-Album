import { getImages } from '../build';

(async () => {
    const data = await getImages(process.argv.slice(2)[0]);

    if (!data[0]) {
        throw new Error('data not found');
    }

    console.info('Test passed');
})();
