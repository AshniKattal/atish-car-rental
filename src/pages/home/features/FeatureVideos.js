import { CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useRef } from "react";

const VideoCard = styled("div")({
  position: "relative",
  width: "100%",
  height: "400px", // Adjust this to your desired height
  overflow: "hidden",
  borderTopLeftRadius: "10px",
  borderBottomRightRadius: "10px",
  border: "1px solid #C0C0C0",
});

const Video = styled("video")({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  opacity: 0,
  transition: "opacity 1s ease-in-out",
});

export default function FeatureVideos({ videoList, backgroundImage }) {
  const videoRefs = useRef([]);
  const currentVideo = useRef(0);

  useEffect(() => {
    const nextVideo = () => {
      videoRefs.current[currentVideo.current].style.opacity = 0;
      currentVideo.current =
        (currentVideo.current + 1) % videoRefs.current.length;
      videoRefs.current[currentVideo.current].style.opacity = 1;
      videoRefs.current[currentVideo.current].play();
    };

    videoRefs.current[currentVideo.current].style.opacity = 1;
    videoRefs.current[currentVideo.current].play();

    videoRefs.current.forEach((video, index) => {
      video.onended = nextVideo;
    });
  }, []);

  return (
    <>
      <div
        style={{
          paddingTop: "2em",
          paddingLeft: "2em",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "100%",
          width: "100%",
          borderRadius: "10px",
          border: "1px solid #C0C0C0",
        }}
      >
        <VideoCard>
          <CardContent>
            {videoList &&
              videoList?.length > 0 &&
              videoList?.map((video, index) => (
                <Video
                  key={index}
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={video?.src}
                  muted
                  style={{ objectFit: video?.objectFit }}
                />
              ))}
          </CardContent>
        </VideoCard>
      </div>
    </>
  );
}
