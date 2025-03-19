"use client";
import { createContext } from "react";
import useSessionStorage from "../_hooks/useSessionStorage";

// Define your interfaces
interface IKeywordsAndImage {
  keyword: string;
  imageUrl: string[];
}

export interface IScriptSegment {
  index: number;
  title?: string;
  text?: string;
  thumbnail?: string;
  keywordsAndImages?: IKeywordsAndImage[];
  videoPath?: string;
  inBetweenVideo?: {
    index: number;
    url: string;
    thumbnail: string;
  };
  audioPath: {
    index: number;
    url: string;
    duration: number;
  };
}

interface IVideoEditingContextType {
  videoBrand: string;
  setVideoBrand: (brand: string) => void;
  selectedContent: string;
  setSelectedContent: (content: string) => void;
  splitedContent: IScriptSegment[] | null;
  setSplitedContent: (content: IScriptSegment[] | null) => void;
  totalIntroSlides: number;
  setTotalIntroSlides: (total: number) => void;
  renderedVideo: string;
  setRenderedVideo: (value: string) => void;
}

const initialContextState: IVideoEditingContextType = {
  videoBrand: "",
  setVideoBrand: () => {},
  selectedContent: "",
  setSelectedContent: () => {},
  splitedContent: null,
  setSplitedContent: (content: IScriptSegment[] | null) => {},
  totalIntroSlides: 4,
  setTotalIntroSlides: () => {},
  renderedVideo: "",
  setRenderedVideo: () => {},
};

// 1- create context, export it
export const videoEditingContext =
  createContext<IVideoEditingContextType>(initialContextState);

// 2- provide context, export it
export default function VideoEditingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [videoBrand, setVideoBrand] = useSessionStorage<string>(
    "VideoEditing-videoBrand",
    "",
    { isSerializable: false }
  );

  const [selectedContent, setSelectedContent] = useSessionStorage<string>(
    "VideoEditing-selectedContent",
    "",
    { isSerializable: false }
  );

  const [splitedContent, setSplitedContent] = useSessionStorage<
    IScriptSegment[] | null
  >("VideoEditing-splitedContent", null);

  const [totalIntroSlides, setTotalIntroSlides] = useSessionStorage<number>(
    "VideoEditing-totalIntroSlides",
    4
  );

  const [renderedVideo, setRenderedVideo] = useSessionStorage<string>(
    "VideoEditing-renderedVideo",
    "",
    { isSerializable: false }
  );

  // Create a context value object
  const contextValue: IVideoEditingContextType = {
    videoBrand,
    setVideoBrand,
    selectedContent,
    setSelectedContent,
    splitedContent,
    setSplitedContent,
    totalIntroSlides,
    setTotalIntroSlides,
    renderedVideo,
    setRenderedVideo,
  };

  return (
    // to provide what i created
    <videoEditingContext.Provider value={contextValue}>
      {children}
    </videoEditingContext.Provider>
  );
}
