# Video Background Setup Instructions

## Video Requirements

### 1. Video File
- **Location**: Replace `/public/videos/homepage-background.mp4` with your actual video file
- **Format**: MP4 (H.264 codec recommended)
- **Duration**: 10-30 seconds (will loop seamlessly)
- **Resolution**: 1920x1080 or 1280x720 recommended
- **File Size**: Keep under 10MB for optimal loading
- **Orientation**: Landscape (16:9 aspect ratio preferred)

### 2. Fallback Image
- **Location**: Replace `/public/images/video-fallback.jpg` with your actual fallback image
- **Format**: JPG or PNG
- **Resolution**: 1920x1080 recommended
- **Purpose**: Shows while video loads and on mobile devices

### 3. WebM Version (Optional but Recommended)
- **Location**: Add `/public/videos/homepage-background.webm` for better browser compatibility
- **Format**: WebM for better compression and quality

## Features Implemented

✅ **Autoplay without sound** (autoplay, muted, loop, playsInline)
✅ **Full-screen coverage** using object-fit: cover
✅ **Centered positioning** with transform: translate(-50%, -50%)
✅ **Behind all content** (z-index: -1)
✅ **Poster fallback** for mobile/slow networks
✅ **Responsive design** compatible with all devices
✅ **Semi-transparent overlay** (rgba(0,0,0,0.4)) for text readability
✅ **Mobile optimization** (uses fallback image on mobile for performance)
✅ **Accessibility** (respects reduced motion and reduced data preferences)

## Browser Compatibility
- Chrome, Firefox, Safari, Edge (all modern versions)
- Mobile browsers (iOS Safari, Android Chrome)
- Graceful fallback for older browsers

## Performance Optimizations
- Video disabled on mobile devices (uses fallback image)
- Preload set to "metadata" for faster initial load
- Fallback image for slow connections
- Respects user's data preferences

## Testing
1. Add your video file to `/public/videos/homepage-background.mp4`
2. Add your fallback image to `/public/images/video-fallback.jpg`
3. Test on desktop and mobile devices
4. Verify video loops seamlessly
5. Check that text remains readable over the video

## Video Optimization Tips
- Use a video compression tool to reduce file size
- Ensure the video loops smoothly (first and last frames should match)
- Test on different devices and connection speeds
- Consider creating multiple resolutions for different devices