import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { GuideDataImagesProps } from "../utils/types";

export const useGuideData = (screenshotId?: string | null) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [guideTitle, setGuideTitle] = useState("");
  const [guideDescription, setGuideDescription] = useState("");
  const [stepsData, setStepsData] = useState<GuideDataImagesProps>([]);
  const [deletingSteps, setDeletingSteps] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupUrl, setPopupUrl] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [initialData, setInitialData] = useState<{
    guideTitle: string;
    guideDescription: string;
    stepsData: GuideDataImagesProps;
  } | null>(null);

  const hanldeIsLoading = (value: boolean) => setIsLoading(value);
  const handleGuideTitle = (value: string) => setGuideTitle(value);
  const handleGuideDescription = (value: string) => setGuideDescription(value);
  // const handleStepsData = (value: GuideDataImagesProps) => setStepsData(value);
  const handleShowPopup = (value: boolean) => setShowPopup(value);

  useEffect(() => {
    if (!screenshotId) return;
    const fetchData = async () => {
      setIsLoading(true);
      setIsFetching(true);
      try {
        if (screenshotId) {
          const docRef = doc(db, "guides", screenshotId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setGuideTitle(data?.guideTitle || "");
            setGuideDescription(data?.guideDescription || "");
            setStepsData(data.guideImages || []);
            setInitialData({
              guideTitle: data?.guideTitle || "",
              guideDescription: data?.guideDescription || "",
              stepsData: data.guideImages || [],
            });
          } else {
            // TODO: not found with id toast
            setNotFound(true);
          }
        } else {
          // TODO: id is null toast
        }
      } catch (error) {
        // TODO: failed to...error toast
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };
    fetchData();
  }, [screenshotId]);

  const updateStep = (
    index: number,
    newTitle: string,
    newDescription: string,
    newCoordinates: { x: number; y: number } | null,
    newScreenshotUrl?: string | null,
    newScale?: number
  ) => {
    const updatedSteps = [...stepsData];
    updatedSteps[index] = {
      ...updatedSteps[index],
      title: newTitle,
      description: newDescription,
      relativeCoordinates: newCoordinates,
      screenshotUrl: newScreenshotUrl ?? null,
      scale: newScale ?? updatedSteps[index].scale,
    };
    setStepsData(updatedSteps);
  };
  const addStep = (
    index: number,
    newTitle: string,
    newDescription: string,
    screenshotUrl: string,
    relativeCoordinates: { x: number; y: number } | null
  ) => {
    const updatedSteps = [...stepsData];
    updatedSteps.splice(index, 0, {
      title: newTitle,
      description: newDescription,
      screenshotUrl,
      relativeCoordinates,
      scale: 1,
      tabTitle: "",
    });
    setStepsData(updatedSteps);
  };
  const deleteStep = async (index: number) => {
    setIsLoading(true);
    setDeletingSteps((prev) => [...prev, index]);
    const imageUrl = stepsData[index].screenshotUrl;

    try {
      if (
        imageUrl &&
        (imageUrl.includes("amazonaws") ||
          imageUrl.includes("guider-extension"))
      ) {
        await fetch("/api/aws", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl }),
        });
      }

      const updatedSteps = [...stepsData];
      updatedSteps.splice(index, 1);
      setStepsData(updatedSteps);
    } catch (error) {
      // TODO: failed to...error toast
    } finally {
      setDeletingSteps((prev) => prev.filter((i) => i !== index));
      setIsLoading(false);
    }
  };
  const handlePublish = async () => {
    setIsLoading(true);
    if (!screenshotId) return;

    try {
      const docRef = doc(db, "guides", screenshotId);
      await updateDoc(docRef, {
        guideTitle: guideTitle || "",
        guideDescription: guideDescription || "",
        guideImages: stepsData,
        timestamp: new Date(),
      });
      // TODO: toast notification
      setPopupUrl("http://localhost:3000/view-guide?id=" + screenshotId);
      setShowPopup(true);
    } catch (e) {
      // TODO: failed to updating...error toast
    }
    setIsLoading(false);
  };
  const hasUnpublishedChanges = () => {
    if (!initialData) return false;
    return (
      guideTitle !== initialData.guideTitle ||
      guideDescription !== initialData.guideDescription ||
      JSON.stringify(stepsData) !== JSON.stringify(initialData.stepsData)
    );
  };
  return {
    notFound,
    isLoading,
    stepsData,
    guideTitle,
    guideDescription,
    addStep,
    deleteStep,
    updateStep,
    handlePublish,
    popupUrl,
    showPopup,
    isFetching,
    deletingSteps,
    setStepsData,
    handleShowPopup,
    hanldeIsLoading,
    handleGuideTitle,
    handleGuideDescription,
    hasUnpublishedChanges,
  };
};
