export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface TitleRun {
  text: string;
}

export interface Title {
  runs: TitleRun[];
}

export interface AccessibilityData {
  label: string;
}

export interface Accessibility {
  accessibilityData: AccessibilityData;
}

export interface PublishedTimeText {
  simpleText: string;
}

export interface LengthText {
  accessibility: Accessibility;
  simpleText: string;
}

export interface ViewCountText {
  simpleText: string;
}

export interface ShortViewCountText {
  accessibility: Accessibility;
  simpleText: string;
}

export interface VideoRenderer {
  videoId: string;
  thumbnail: {
    thumbnails: Thumbnail[];
  };
  title: Title;
  publishedTimeText: PublishedTimeText;
  lengthText: LengthText;
  viewCountText: ViewCountText | { runs: { text: string }[] };
  shortViewCountText: ShortViewCountText;
}

export interface RichItemRenderer {
  content: {
    videoRenderer: VideoRenderer;
  };
}

export interface RichGridContents {
  richItemRenderer: RichItemRenderer;
}

export interface RichGridRenderer {
  contents: RichGridContents[];
}

export interface TabRenderer {
  content: {
    richGridRenderer: RichGridRenderer;
  };
}

export interface Tabs {
  tabRenderer: TabRenderer;
}

export interface TwoColumnBrowseResultsRenderer {
  tabs: Tabs[];
}

export interface Contents {
  twoColumnBrowseResultsRenderer: TwoColumnBrowseResultsRenderer;
}

export interface YouTubeScriptResponse {
  contents?: Contents;
}
