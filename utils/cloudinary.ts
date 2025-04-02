import crypto from 'crypto';

// Fungsi untuk signed upload di server side
export const generateSignature = (publicId: string, timestamp: number) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!cloudName || !apiSecret) {
    throw new Error('Konfigurasi Cloudinary tidak lengkap');
  }
  
  // Format string yang akan di-hash
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  
  // Buat signature dengan SHA-1
  return crypto.createHash('sha1').update(stringToSign).digest('hex');
};

// Fungsi untuk memanggil upload dari client side
export const uploadProductImage = async (file: File): Promise<{ url: string; public_id: string }> => {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRODUCT_PRESET;
    
    if (!cloudName || !uploadPreset) {
      throw new Error('Konfigurasi Cloudinary tidak lengkap');
    }
    
    // Untuk upload signed, kita akan menggunakan API endpoint custom
    // Tapi untuk sekarang, kita gunakan upload preset saja
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'product_images');
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Gagal upload gambar');
    }
    
    const data = await response.json();
    return {
      url: data.secure_url,
      public_id: data.public_id
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Helper untuk mendapatkan optimized URLs
export const getOptimizedImageUrl = (url: string, width = 600, height = 600, quality = 'auto') => {
  if (!url.includes('cloudinary.com')) return url; // Bukan URL Cloudinary
  
  // Memastikan bahwa URL transformation valid untuk Next.js Image
  const cloudinaryUrlParts = url.split('/upload/');
  if (cloudinaryUrlParts.length !== 2) return url;
  
  return `${cloudinaryUrlParts[0]}/upload/c_fill,g_auto,h_${height},w_${width},q_${quality}/${cloudinaryUrlParts[1]}`;
};

// Helper untuk placeholder blur
export const getBlurDataURL = (url: string) => {
  if (!url.includes('cloudinary.com')) return undefined;
  
  const cloudinaryUrlParts = url.split('/upload/');
  if (cloudinaryUrlParts.length !== 2) return undefined;
  
  return `${cloudinaryUrlParts[0]}/upload/c_fill,g_auto,h_10,w_10,e_blur:1000,q_10/${cloudinaryUrlParts[1]}`;
}; 