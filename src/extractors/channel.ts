import { load } from 'cheerio';
import { sendRequest } from '../request';
import type { ViewCountText, YouTubeScriptResponse } from './channel.types';
import { isStream } from './utils';

const baseUrl = 'https://www.youtube.com/';

export const getVideos = async (channelId: string) => {
  try {
    if (!channelId.startsWith('@')) {
      throw new Error(
        "Invalid channel Id. Channel name must start with '@' i.e @mistahfeet"
      );
    }
    const url = `${baseUrl}/${channelId}/videos`;

    const data = await sendRequest(url);
    const $ = load(data);

    const scriptTags = $('script');

    const regex = /var\s+ytInitialData\s+=\s+({.*?});/;

    const videosArray: {
      title?: string;
      videoId?: string;
      thumbnailUrl?: string;
      publishedTime?: string;
      length: string;
      viewCount: number;
    }[] = [];

    for (let i = 0; i < scriptTags.length; i++) {
      const scriptContent = $(scriptTags[i]).html();
      if (scriptContent) {
        const match = scriptContent.match(regex);
        if (match && match[1]) {
          const videos = (JSON.parse(match[1]) as YouTubeScriptResponse)
            ?.contents?.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer
            .content.richGridRenderer.contents;

          videos?.forEach((videoItem) => {
            const videoData =
              videoItem?.richItemRenderer?.content?.videoRenderer;
            if (!videoData) return;

            const title = videoData.title?.runs[0]?.text;
            const videoId = videoData.videoId;
            const thumbnailUrl = videoData.thumbnail?.thumbnails.find(
              (t) => t.width >= 300
            )?.url;
            const publishedTime = videoData.publishedTimeText?.simpleText;
            const length = videoData.lengthText?.simpleText;
            const viewCount = Number(
              (videoData.viewCountText as ViewCountText)?.simpleText
                .match(/[0-9,]+/g)?.[0]
                .replace(/,/g, '')
            );

            videosArray.push({
              title,
              thumbnailUrl,
              length,
              publishedTime,
              videoId,
              viewCount,
            });
          });
        }
      }
    }

    return videosArray;
  } catch (error) {
    console.error('Error in getVideos:', error);
    throw error;
  }
};

export const getStreams = async (channelId: string) => {
  try {
    if (!channelId.startsWith('@')) {
      throw new Error(
        "Invalid channel Id. Channel name must start with '@' i.e @mistahfeet"
      );
    }
    const url = `${baseUrl}/${channelId}/streams`;

    const data = await sendRequest(url);
    const $ = load(data);

    const scriptTags = $('script');

    const regex = /var\s+ytInitialData\s+=\s+({.*?});/;

    const videosArray: {
      title?: string;
      videoId?: string;
      thumbnailUrl?: string;
      publishedTime?: string;
      length: string;
      viewCount: number;
    }[] = [];

    for (let i = 0; i < scriptTags.length; i++) {
      const scriptContent = $(scriptTags[i]).html();
      if (scriptContent) {
        const match = scriptContent.match(regex);
        if (match && match[1]) {
          const videos = (JSON.parse(match[1]) as YouTubeScriptResponse)
            ?.contents?.twoColumnBrowseResultsRenderer.tabs[3].tabRenderer
            .content.richGridRenderer.contents;

          videos?.forEach((videoItem) => {
            const videoData =
              videoItem?.richItemRenderer?.content?.videoRenderer;
            if (!videoData) return;

            const title = videoData.title?.runs[0]?.text;
            const videoId = videoData.videoId;
            const thumbnailUrl = videoData.thumbnail?.thumbnails.find(
              (t) => t.width >= 300
            )?.url;
            const publishedTime = videoData.publishedTimeText?.simpleText;
            const length = videoData.lengthText?.simpleText;
            const viewCount = isStream(videoData)
              ? Number(
                  (videoData.viewCountText as { runs: { text: string }[] })
                    .runs[0].text
                )
              : Number(
                  (videoData.viewCountText as ViewCountText)?.simpleText
                    .match(/[0-9,]+/g)?.[0]
                    .replace(/,/g, '')
                );

            videosArray.push({
              title,
              thumbnailUrl,
              length,
              publishedTime,
              videoId,
              viewCount,
            });
          });
        }
      }
    }

    return videosArray;
  } catch (error) {
    console.error('Error in getStreams:', error);
    throw error;
  }
};

export const isLive = async (channelId: string) => {
  try {
    if (!channelId.startsWith('@')) {
      throw new Error(
        "Invalid channel Id. Channel name must start with '@' i.e @mistahfeet"
      );
    }
    const url = `${baseUrl}/${channelId}/streams`;

    const data = await sendRequest(url);
    const $ = load(data);

    const scriptTags = $('script');

    const regex = /var\s+ytInitialData\s+=\s+({.*?});/;

    let status: boolean = false;

    for (let i = 0; i < scriptTags.length; i++) {
      const scriptContent = $(scriptTags[i]).html();
      if (scriptContent) {
        const match = scriptContent.match(regex);
        if (match && match[1]) {
          status = isStream(
            (JSON.parse(match[1]) as YouTubeScriptResponse)?.contents
              ?.twoColumnBrowseResultsRenderer.tabs[3].tabRenderer.content
              .richGridRenderer.contents[0]?.richItemRenderer?.content
              ?.videoRenderer
          );
        }
      }
    }

    return status;
  } catch (error) {
    console.error('Error in isLive:', error);
    throw error;
  }
};
