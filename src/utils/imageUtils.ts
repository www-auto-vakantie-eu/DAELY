export const getGenderedImage = (originalUrl: string, preference: 'man' | 'woman' | 'none', type: 'workout' | 'nutrition' | 'mind' = 'workout') => {
  if (preference === 'none' || !originalUrl) return originalUrl;
  
  // Create a simple hash from the original URL to keep the image consistent
  let hash = 0;
  for (let i = 0; i < originalUrl.length; i++) {
    hash = ((hash << 5) - hash) + originalUrl.charCodeAt(i);
    hash |= 0;
  }
  
  const seed = `${preference}_${type}_${Math.abs(hash)}`;
  return `https://picsum.photos/seed/${seed}/800/800`;
};
