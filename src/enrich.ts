import { ICloud } from './types';

export const enrichImagesWithUrls = (
  apiResponse: ICloud.ApiResponse,
  urls: Record<string, string>,
): ICloud.Image[] => {
  const photos = Object.values(apiResponse.photos);

  const photosWithDerivativeUrls = photos.map((photo) => {
    const derivativesObject = Object.values(
      photo.derivatives as unknown as Record<string, ICloud.Derivative>,
    );

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

    return { ...photo, derivatives };
  });

  return photosWithDerivativeUrls;
};
