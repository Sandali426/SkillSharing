export const uploadFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Store in local storage
      const fileName = `${Date.now()}-${file.name}`;
      localStorage.setItem(fileName, dataUrl);
      // Return data URL for display
      resolve(dataUrl);
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
};