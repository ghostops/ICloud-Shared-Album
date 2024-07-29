import { ICloud } from './types';

export const enrichImagesWithUrls = (
  apiResponse: ICloud.ApiResponse,
  urls: Record<string, string>,
): ICloud.Image[] => {
  const photos = Object.values(apiResponse.photos);

  const photosWithDerivativeUrls = photos.map(enrichAssetWithUrl(urls));

  return photosWithDerivativeUrls;
};

export const enrichAssetWithUrl =
  (urls: Record<string, string>) =>
  (asset: ICloud.Image): ICloud.Image => {
    const derivativesObject = Object.values(asset.derivatives);

    const duplicateCount = [];

    const derivatives = derivativesObject.reduce((root, derivative) => {
      if (typeof urls[derivative.checksum] === 'undefined') {
        return root;
      }

      let derivativeKey: string = derivative.height.toString();

      if (!!root[derivativeKey]) {
        duplicateCount.push(derivativeKey);

        const duplicateIndex = duplicateCount.filter(
          (duplicate) => duplicate === derivativeKey,
        ).length;

        derivativeKey = derivativeKey + '-' + duplicateIndex;
      }

      return {
        ...root,
        [derivativeKey]: {
          ...derivative,
          url: urls[derivative.checksum],
        },
      };
    }, {});

    return { ...asset, derivatives };
  };
