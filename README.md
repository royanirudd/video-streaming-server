# video-streaming-server
## File System (Range-Based) Streaming:
This method uses Node.js's built-in fs module to stream video chunks based on HTTP Range requests. When a client (like a video player) requests a video, it can ask for specific byte ranges of the file using the Range header. The server then responds with only the requested portion of the video using HTTP 206 Partial Content responses. This approach is memory-efficient as it doesn't load the entire video file into memory at once. It's perfect for simple video streaming needs and works well with most modern browsers' native video players. However, it doesn't provide adaptive quality based on network conditions, and the video quality remains constant throughout playback. This method is simpler to implement and requires no preprocessing, making it ideal for smaller applications or when quick implementation is needed.

## HLS (HTTP Live Streaming):
This method uses FFmpeg to transcode the original video into multiple quality levels (360p, 480p, 720p in our implementation) and splits each quality level into small segments (10-second chunks in our case). It creates a master playlist (master.m3u8) that contains references to different quality streams, and each quality stream has its own playlist (.m3u8) containing references to the video segments (.ts files). The client can switch between different quality levels seamlessly based on network conditions, providing a better viewing experience across varying network speeds. This method requires more server resources for initial transcoding and more storage space to keep multiple versions of the same video, but it offers superior streaming capabilities, especially for larger audiences and varying network conditions. 

## Differences:
- FS is immediate but fixed quality
- HLS requires preprocessing but offers adaptive quality
- FS streaming uses less storage but provides fewer features
- HLS uses more storage but offers better user expreience
- FS is simpler to implement and maintain
- HLS is more complex but provides more prefessional streaming capabilities
