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
