// Redundant FILE.
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dkb0s3cm8",
  api_key: "771396424836289",
  api_secret: "jB5pbaRH4S-UkLXXhGiMVsjM5Y4",
});

export const uploadImageToCloudinary = async (base64Image: string) => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "guide-screenshots",
      resource_type: "image",
    });

    return result.secure_url; // Returns Cloudinary image URL
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image");
  }
};

export const deleteImageFromCloudinary = async (imageUrl: string) => {
  try {
    console.log("imageUrl", imageUrl);
    const publicId = imageUrl.split("/upload/")[1].split(".")[0];

    console.log("publicId", publicId);
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new Error("Cloudinary image deletion failed");
    }

    console.log("Image deleted successfully:", publicId);
    return true;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return false;
  }
};
