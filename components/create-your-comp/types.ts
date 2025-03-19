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
  screenshotUrl: string;
  relativeCoordinates: { x: number; y: number };
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
    screenshotUrl: string;
    relativeCoordinates: { x: number; y: number };
  };
  index: number;
  imageRefs: any;
  updateStep: (
    index: number,
    newTitle: string,
    newDescription: string,
    newCoordinates?: { x: number; y: number },
    newScreenshotUrl?: string
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
