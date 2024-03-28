import { sendRequest } from '../request';
import { load } from 'cheerio';
import type { Thumbnail } from './channel.types';

const baseUrl = 'https://www.youtube.com/watch?v=';

export const getInfo = async (videoId: string) => {
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
          const basicFormats: {
            itag?: number;
            url?: string;
            mimeType?: string;
            bitrate?: number;
            width?: number;
            height?: number;
            lastModified?: string;
            contentLength?: string;
            quality?: string;
            fps?: number;
            qualityLabel?: string;
            projectionType?: string;
            averageBitrate?: number;
            audioQuality?: string;
            approxDurationMs?: string;
            audioSampleRate?: string;
            audioChannels?: number;
          }[] = parsedData.streamingData.formats;

          const adaptiveFormats: {
            itag?: number;
            url?: string;
            mimeType?: string;
            bitrate?: number;
            width?: number;
            height?: number;
            initRange?: {
              start: string;
              end: string;
            };
            indexRange?: {
              start: string;
              end: string;
            };
            lastModified?: string;
            contentLength?: string;
            quality?: string;
            fps?: number;
            qualityLabel?: string;
            projectionType?: string;
            averageBitrate?: number;
            colorInfo?: {
              primaries: string;
              transferCharacteristics: string;
              matrixCoefficients: string;
            };
            approxDurationMs?: string;
            highReplication?: boolean;
            audioQuality?: string;
            audioSampleRate?: string;
            audioChannels?: number;
            loudnessDb?: number;
          }[] = parsedData.streamingData.adaptiveFormats;

          const formats = { basicFormats, adaptiveFormats };

          const details: {
            videoId?: string;
            title?: string;
            lengthSeconds?: string;
            keywords?: string[];
            channelId?: string;
            isOwnerViewing?: boolean;
            shortDescription?: string;
            isCrawlable?: boolean;
            thumbnail?: {
              thumbnails: Thumbnail[];
            };
            allowRatings?: boolean;
            viewCount?: string;
            author?: string;
            isPrivate?: boolean;
            isUnpluggedCorpus?: boolean;
            isLiveContent?: boolean;
          } = parsedData.videoDetails;

          return {
            ...formats,
            details,
          };
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
