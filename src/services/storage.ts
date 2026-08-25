export async function uploadToS3(file: File): Promise<string> {
  console.log('Demo mode uploading file:', file.name);

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => {
      // Fallback unsplash image if file reading fails
      resolve('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80');
    };
    reader.readAsDataURL(file);
  });
}
