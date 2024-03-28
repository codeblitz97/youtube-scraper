import type { Thumbnail } from './channel.types';

export interface BasicFormat {
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
}

export interface AdaptiveFormat {
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
}

export interface Format {
  basicFormats: BasicFormat[];
  adaptiveFormats: AdaptiveFormat[];
}

export interface Details {
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
}

export interface Info {
  basicFormats: BasicFormat[];
  adaptiveFormats: AdaptiveFormat[];
  details: Details;
}
