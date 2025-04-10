export type AddCompProps = {
  index: number;
  addStep: (
    index: number,
    newTitle: string,
    newDescription: string,
    screenshotUrl: string,
    relativeCoordinates: { x: number; y: number } | null
  ) => void;
};

export type GuideDataImagesProps = {
  title: string;
  description: string;
  screenshotUrl: string | null;
  relativeCoordinates: { x: number; y: number } | null;
  scale: number;
  tabTitle: string;
}[];

export type GuideDataProps = {
  guideTitle: string;
  guideDescription: string;
  guideImages: GuideDataImagesProps;
  timestamp: string;
};

export interface StepProps {
  step: {
    title: string;
    description: string;
    screenshotUrl: string | null;
    relativeCoordinates: { x: number; y: number } | null;
    scale: number;
  };
  index: number;
  imageRefs: React.RefObject<(HTMLImageElement | null)[]>;
  setIsLoading: (isLoading: boolean) => void;
  updateStep: (
    index: number,
    newTitle: string,
    newDescription: string,
    newCoordinates: { x: number; y: number } | null,
    newScreenshotUrl: string | null,
    scale?: number
  ) => void;
  addStep: (
    index: number,
    newTitle: string,
    newDescription: string,
    screenshotUrl: string,
    relativeCoordinates: { x: number; y: number } | null
  ) => void;
  deleteStep: (index: number) => void;
}

export type HeaderProps = {
  textValue: string;
  textColor: string;
  textSize: string;
  placeholderValue: string;
  setText: (newText: string) => void;
};

export type ChangeImagePopupProps = {
  oldImageUrl: string;
  handleImageUpload: (imageLink: string) => void;
  setShowChangeImagePopup: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: (isLoading: boolean) => void;
};

export interface RequestBody {
  title: string;
  relativeCoordinates: {
    x: number;
    y: number;
  };
  description?: string;
  screenshotUrl: string;
  tabTitle?: string;
}
