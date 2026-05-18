import express from "express";
import cors from "cors";
import ytdl from "@distube/ytdl-core";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/video", async (req, res) => {
  try {
    const { url } = req.body;

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({
        error: "Invalid YouTube URL"
      });
    }

    const info = await ytdl.getInfo(url);

    const formats = info.formats
      .filter(f =>
        f.hasVideo &&
        f.container &&
        f.url
      )
      .map(f => ({
        quality: f.qualityLabel || "unknown",
        format: f.container,
        fps: f.fps,
        url: f.url
      }));

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      duration: info.videoDetails.lengthSeconds,
      formats
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch video"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});