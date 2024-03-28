import { sendRequest } from '../request';
import { load } from 'cheerio';
import type {
  AdaptiveFormat,
  BasicFormat,
  Details,
  Format,
  Info,
} from './info.types';

const baseUrl = 'https://www.youtube.com/watch?v=';

export const getInfo = async (
  videoId: string
): Promise<Info | { message?: string } | undefined> => {
  try {
    const data = await sendRequest(baseUrl + videoId);
    const $ = load(data);

    const scriptTags = $('script');

    const regex = /var\s+ytInitialPlayerResponse\s+=\s+({.*?});/;

    for (let i = 0; i < scriptTags.length; i++) {
      const scriptContent = $(scriptTags[i]).html();
      if (scriptContent) {
        const match = scriptContent.match(regex);
        if (match && match[1]) {
          const parsedData = JSON.parse(match[1]);
          const basicFormats: BasicFormat[] = parsedData.streamingData.formats;

          const adaptiveFormats: AdaptiveFormat[] =
            parsedData.streamingData.adaptiveFormats;

          const formats: Format = { basicFormats, adaptiveFormats };

          const details: Details = parsedData.videoDetails;

          return {
            ...formats,
            details,
          };
        }
      }
    }
  } catch (error) {
    return { message: (error as Error).message };
  }
};
