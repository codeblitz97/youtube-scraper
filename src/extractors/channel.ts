import { load } from 'cheerio';
import { sendRequest } from '../request';
import type {
  AllResponse,
  Short,
  Stream,
  Video,
  ViewCountText,
  YouTubeScriptResponse,
} from './channel.types';
import { isMessage, isStream } from './utils';

const baseUrl = 'https://www.youtube.com/';

export const getVideos = async (
  channelId: string
): Promise<Video[] | { message: string }> => {
  try {
    if (!channelId.startsWith('@')) {
      throw new Error(
        "Invalid channel Id. Channel name must start with '@' i.e @mistahfeet"
      );
    }
    const url = `${baseUrl}/${channelId}/videos`;

    const data = await sendRequest(url);

    const regex = /var\s+ytInitialData\s+=\s+({.*?});/;
    const match = data.match(regex);
    if (!match || !match[1]) {
      throw new Error('Failed to parse video data');
    }

    const videos = JSON.parse(match[1]).contents?.twoColumnBrowseResultsRenderer
      .tabs[1].tabRenderer.content.richGridRenderer.contents;

    if (!videos) {
      throw new Error('No videos found');
    }

    const videosArray = await Promise.all(
      videos.map(async (videoItem: any) => {
        const videoData = videoItem?.richItemRenderer?.content?.videoRenderer;
        if (!videoData) return null;

        const title = videoData.title?.runs[0]?.text;
        const videoId = videoData.videoId;
        const thumbnails = videoData.thumbnail?.thumbnails;
        const thumbnailUrl = videoData.thumbnail?.thumbnails.find(
          (t: any) => t.width >= 300
        )?.url;
        const publishedTime = videoData.publishedTimeText?.simpleText;
        const length = videoData.lengthText?.simpleText;
        const description = videoData.descriptionSnippet.runs[0].text;
        const viewCount = Number(
          (videoData.viewCountText as ViewCountText)?.simpleText
            .match(/[0-9,]+/g)?.[0]
            .replace(/,/g, '')
        );

        return {
          videoId,
          title,
          description,
          thumbnails,
          thumbnailUrl,
          length,
          publishedTime,
          viewCount,
        };
      })
    );

    return videosArray.filter((video: any) => video !== null);
  } catch (error) {
    return { message: (error as Error).message };
  }
};

export const getStreams = async (
  channelId: string
): Promise<Stream[] | { message: string }> => {
  try {
    if (!channelId.startsWith('@')) {
      throw new Error(
        "Invalid channel Id. Channel name must start with '@' i.e @mistahfeet"
      );
    }
    const url = `${baseUrl}/${channelId}/videos`;

    const data = await sendRequest(url);

    const regex = /var\s+ytInitialData\s+=\s+({.*?});/;
    const match = data.match(regex);
    if (!match || !match[1]) {
      throw new Error('Failed to parse video data');
    }

    const videos = JSON.parse(match[1]).contents?.twoColumnBrowseResultsRenderer
      .tabs[3].tabRenderer.content.richGridRenderer.contents;

    if (!videos) {
      throw new Error('No videos found');
    }

    const videosArray = await Promise.all(
      videos.map(async (videoItem: any) => {
        const videoData = videoItem?.richItemRenderer?.content?.videoRenderer;
        if (!videoData) return null;

        const title = videoData.title?.runs[0]?.text;
        const videoId = videoData.videoId;
        const thumbnailUrl = videoData.thumbnail?.thumbnails.find(
          (t: any) => t.width >= 300
        )?.url;
        const publishedTime = videoData.publishedTimeText?.simpleText;
        const length = videoData.lengthText?.simpleText;
        const description = videoData.descriptionSnippet.runs[0].text;

        const viewCount = Number(
          (videoData.viewCountText as ViewCountText)?.simpleText
            .match(/[0-9,]+/g)?.[0]
            .replace(/,/g, '')
        );

        return {
          videoId,
          title,
          description,
          thumbnailUrl,
          length,
          publishedTime,
          viewCount,
        };
      })
    );

    return videosArray.filter((video: any) => video !== null);
  } catch (error) {
    return { message: (error as Error).message };
  }
};

export const getShorts = async (
  channelId: string
): Promise<Short[] | { message: string }> => {
  try {
    if (!channelId.startsWith('@')) {
      throw new Error(
        "Invalid channel Id. Channel name must start with '@' i.e @mistahfeet"
      );
    }
    const url = `${baseUrl}/${channelId}/shorts`;

    const data = await sendRequest(url);

    const regex = /var\s+ytInitialData\s+=\s+({.*?});/;
    const match = data.match(regex);

    if (!match || !match[1]) {
      throw new Error('Failed to parse video data');
    }

    const videos = JSON.parse(match[1]).contents?.twoColumnBrowseResultsRenderer
      .tabs[2].tabRenderer.content.richGridRenderer.contents;

    if (!videos) {
      throw new Error('No videos found');
    }

    const videosArray = await Promise.all(
      videos.map(async (videoItem: any) => {
        const videoData =
          videoItem?.richItemRenderer?.content?.reelItemRenderer;

        console.log(videoData);
        if (!videoData) return null;

        const videoId = videoData.videoId;
        const thumbnailUrl = videoData.thumbnail?.thumbnails.find(
          (t: any) => t.width >= 300
        )?.url;

        const viewCount = String(
          (videoData.viewCountText as ViewCountText)?.simpleText
        );

        return {
          videoId,
          thumbnailUrl,
          viewCount,
        };
      })
    );

    return videosArray.filter((video: any) => video !== null);
  } catch (error) {
    return { message: (error as Error).message };
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
    return { message: (error as Error).message };
  }
};

export const getAll = async (
  channelId: string
): Promise<AllResponse | undefined> => {
  try {
    const streamsPromise = getStreams(channelId);
    const videosPromise = getVideos(channelId);
    const shortsPromise = getShorts(channelId);

    let [shorts, streams, videos] = await Promise.all([
      shortsPromise,
      streamsPromise,
      videosPromise,
    ]);

    if (!isMessage(shorts)) {
      shorts = [];
    }
    if (!isMessage(videos)) {
      videos = [];
    }
    if (!isMessage(streams)) {
      streams = [];
    }

    return { videos, streams, shorts } as AllResponse;
  } catch (error) {
    return { shorts: [], streams: [], videos: [] };
  }
};
