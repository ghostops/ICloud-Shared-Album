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

    const derivatives = derivativesObject.reduce((root, derivative) => {
      if (typeof urls[derivative.checksum] === 'undefined') {
        return root;
      }

      return {
        ...root,
        [derivative.height]: {
          ...derivative,
          url: urls[derivative.checksum],
        },
      };
    }, {});

    return { ...photo, derivatives };
  });

  return photosWithDerivativeUrls;
};
