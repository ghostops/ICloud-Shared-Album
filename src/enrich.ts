import { ICloud } from './types';

export const enrichImages = (metadata: ICloud.Metadata, urls: Record<string, string>): ICloud.ImageWithUrl[] => {
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
