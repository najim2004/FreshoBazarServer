import ImageKit from "imagekit";
import { config } from "../config/env.config.js";

const imagekit = new ImageKit({
  publicKey: config.imagekitPublicKey,
  privateKey: config.imagekitPrivateKey,
  urlEndpoint: config.imagekitUrlEndpoint,
});

export class ImageService {
  async uploadImage(filePath) {
    try {
      const result = await imagekit.upload({
        file: filePath,
        fileName: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      });
      return {
        url: result.url,
        public_id: result.fileId,
      };
    } catch (error) {
      console.log("image upload error", error);
      throw new Error("Image upload failed");
    }
  }

  async deleteImage(fileId) {
    try {
      const result = await imagekit.deleteFile(fileId);
      return result;
    } catch (error) {
      throw new Error("Image deletion failed");
    }
  }

  async updateImage(fileId, filePath) {
    try {
      await this.deleteImage(fileId);
      const result = await this.uploadImage(filePath);
      return result;
    } catch (error) {
      throw new Error("Image update failed");
    }
  }
}
