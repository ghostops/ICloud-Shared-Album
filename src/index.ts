import { enrichImages } from './enrich';
import { getBaseUrl } from './baseUrl';
import { getPhotoMetadata, getUrls } from './metadata';
import { ICloud } from './types';
import * as _chunk from 'lodash.chunk';

export * from './types';

export const getImages = async (token: string): Promise<ICloud.ImageWithUrl[]> => {
    const baseUrl = getBaseUrl(token);

    const metadata = await getPhotoMetadata(baseUrl);

    const chunks = _chunk(metadata.photoGuids, 25);
    
    let allUrls: Record<string, string> = {};

    for (const chunk of chunks) {
        const urls = await getUrls(baseUrl, chunk);
        allUrls = Object.assign(allUrls, urls);
    }

    return enrichImages(metadata, allUrls);
}

export default getImages;
