import { enrichImagesWithUrls } from './enrich';
import { getBaseUrl } from './baseUrl';
import { getApiResponse, getUrls } from './api';
import { ICloud } from './types';
import { chunk } from './chunk';

export { enrichAssetWithUrl } from './enrich';
export * from './types';

export const getImages = async (token: string): Promise<ICloud.Response> => {
  const baseUrl = getBaseUrl(token);

  const apiResponse = await getApiResponse(baseUrl);

  const chunks = chunk(apiResponse.photoGuids, 25);

  let allUrls: Record<string, string> = {};

  for (const chunk of chunks) {
    const urls = await getUrls(baseUrl, chunk);
    allUrls = Object.assign(allUrls, urls);
  }

  return {
    metadata: apiResponse.metadata,
    photos: enrichImagesWithUrls(apiResponse, allUrls),
  };
};

export const getSharedAlbumData = async (token: string): Promise<ICloud.ApiResponse> => {
  const baseUrl = getBaseUrl(token);
  return getApiResponse(baseUrl);
};

export const getWebAssetUrls = async (token: string, guids: string[]) => {
  const baseUrl = getBaseUrl(token);
  return getUrls(baseUrl, guids);
};

export default getImages;
