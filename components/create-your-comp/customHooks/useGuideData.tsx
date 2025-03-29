import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../app/api/save-screenshot/firebaseConfig";
import { GuideDataImagesProps } from "../types";

export const useGuideData = (screenshotId?: string | null) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [guideTitle, setGuideTitle] = useState("");
  const [guideDescription, setGuideDescription] = useState("");
  const [stepsData, setStepsData] = useState<GuideDataImagesProps>([]);
  const [deletingSteps, setDeletingSteps] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupUrl, setPopupUrl] = useState("");
  // const deleteImageOnPublishList: string[] = [];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsFetching(true);
      try {
        if (screenshotId) {
          const docRef = doc(db, "guides", screenshotId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setGuideTitle(docSnap.data()?.guideTitle);
            setGuideDescription(docSnap.data()?.guideDescription);
            setStepsData(docSnap.data().guideImages);
          } else {
            console.warn(`Document with ID ${screenshotId} not found.`);
          }
        } else {
          console.warn("screenshotId is null.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
    relativeCoordinates: { x: number; y: number }
  ) => {
    const updatedSteps = [...stepsData];
    updatedSteps.splice(index, 0, {
      title: newTitle,
      description: newDescription,
      screenshotUrl,
      relativeCoordinates,
      scale: 1,
    });
    setStepsData(updatedSteps);
  };
  const deleteStep = async (index: number) => {
    setIsLoading(true);
    setDeletingSteps((prev) => [...prev, index]);
    const imageUrl = stepsData[index].screenshotUrl;
    // deleteImageOnPublishList.push(imageUrl!);
    // console.log("deleteImageOnPublishList: ", deleteImageOnPublishList);

    try {
      if (
        imageUrl &&
        (imageUrl.includes("amazonaws") ||
          imageUrl.includes("guider-extension"))
      ) {
        // deleteImageOnPublishList.push(imageUrl);
        await fetch("/api/aws", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl }),
        });

        console.log("Image deleted from AWS");
      }

      const updatedSteps = [...stepsData];
      updatedSteps.splice(index, 1);
      setStepsData(updatedSteps);
    } catch (error) {
      console.error("Failed to delete image:", error);
    } finally {
      setDeletingSteps((prev) => prev.filter((i) => i !== index));
      setIsLoading(false);
    }

    // by doing this need fs lib cause clodinary works on srver side like on nodejs
    // deleteImageFromCloudinary(stepsData[index].screenshotUrl);
    // const updatedSteps = [...stepsData];
    // updatedSteps.splice(index, 1);
    // setStepsData(updatedSteps);
  };
  const handlePublish = async () => {
    setIsLoading(true);
    if (!screenshotId) return;

    try {
      const docRef = doc(db, "guides", screenshotId);
      // console.log("docRef: ", docRef);
      await updateDoc(docRef, {
        guideTitle: guideTitle || "",
        guideDescription: guideDescription || "",
        guideImages: stepsData,
      });
      // alert("Guide updated successfully!");
      setPopupUrl("http://localhost:3000/view-guide?id=" + screenshotId);
      // setPopupUrl("https://localhost:3000/create-your-comp/view-guide?id=" + screenshotId);
      setShowPopup(true);

      // if (deleteImageOnPublishList.length > 0) {
      //   for (const imageUrl of deleteImageOnPublishList) {
      //     await fetch("/api/aws", {
      //       method: "DELETE",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({ imageUrl }),
      //     });
      //   }
      // }
      // console.log("deleteImageOnPublishList: ", deleteImageOnPublishList);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    setIsLoading,
    guideTitle,
    setGuideTitle,
    guideDescription,
    setGuideDescription,
    stepsData,
    setStepsData,
    updateStep,
    addStep,
    deleteStep,
    handlePublish,
    deletingSteps,
    showPopup,
    setShowPopup,
    popupUrl,
    isFetching,
  };
};
