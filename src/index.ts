import { enrichImagesWithUrls } from './enrich';
import { getBaseUrl } from './baseUrl';
import { getApiResponse, getUrls } from './api';
import { ICloud } from './types';
import * as chunk from 'lodash.chunk';
import { getRedirectedBaseUrl } from './redirectedBaseUrl';

export * from './types';

export const getImages = async (token: string): Promise<ICloud.Response> => {
  const baseUrl = getBaseUrl(token);
  // in 2024 Apple began issuing a 330 (redirect), so we need to deal with that:
  const redirectedBaseUrl = await getRedirectedBaseUrl(baseUrl, token);

  const apiResponse = await getApiResponse(redirectedBaseUrl);

  const chunks = chunk(apiResponse.photoGuids, 25);

  let allUrls: Record<string, string> = {};

  for (const chunk of chunks) {
    const urls = await getUrls(redirectedBaseUrl, chunk);
    allUrls = Object.assign(allUrls, urls);
  }

  return {
    metadata: apiResponse.metadata,
    photos: enrichImagesWithUrls(apiResponse, allUrls),
  };
};

export default getImages;
