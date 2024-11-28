import { pb } from './pocketbase';

// Configuration for your FTP/Upload service
const UPLOAD_SERVICE_URL = 'http://217.76.51.2:8091/upload'; // Update this with your upload service URL

export interface UploadResponse {
  url: string;
  success: boolean;
  error?: string;
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Upload to PocketBase storage
    const record = await pb.collection('products').create({
      image: formData.get('file')
    });

    const imageUrl = pb.files.getUrl(record, record.image);

    return {
      success: true,
      url: imageUrl
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to upload image';
    return {
      success: false,
      url: '',
      error: errorMessage
    };
  }
};
