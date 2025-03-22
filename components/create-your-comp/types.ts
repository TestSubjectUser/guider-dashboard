export type AddCompProps = {
  index: number;
  addStep: (
    index: number,
    newTitle: string,
    newDescription: string,
    screenshotUrl: string,
    relativeCoordinates: { x: number; y: number }
  ) => void;
};

export type GuideDataImagesProps = {
  title: string;
  description: string;
  screenshotUrl: string | null;
  relativeCoordinates: { x: number; y: number } | null;
  scale: number;
}[];

export type GuideDataProps = {
  guideTitle: string;
  guideDescription: string;
  guideImages: GuideDataImagesProps;
  timestamp: Date;
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
  imageRefs: any;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  updateStep: (
    index: number,
    newTitle: string,
    newDescription: string,
    newCoordinates: { x: number; y: number } | null,
    newScreenshotUrl?: string | null,
    scale?: number
  ) => void;
  addStep: (
    index: number,
    newTitle: string,
    newDescription: string,
    screenshotUrl: string,
    relativeCoordinates: { x: number; y: number }
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
  screenshotUrl: string;
  urlWeAreOn: string;
}
