export function fileType(file: File | null): 'video' | 'image' {
   if (file) {
      const fileType = file.type;

      if (fileType.startsWith('image/')) {
         console.log('The file is an image.');
         return 'image';
         // Handle image file
      } else if (fileType.startsWith('video/')) {
         console.log('The file is a video.');
         return 'video';
         // Handle video file
      } else {
         console.log('The file is neither an image nor a video.');
         // Handle other file types
         return 'image';
      }
   }
   return 'image';
}
