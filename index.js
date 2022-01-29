const express = require("express");
const app = express();

const { statSync, createReadStream } = require("fs");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, res) => {
  const range = req.headers.range;
  if (!range) res.status(400).send("Requires Range header");
  const videoPath = "test.mp4";
  const videoSize = statSync(videoPath).size;
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Type": "video/mp4",
    "Content-Range": `bytes ${start} - ${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
  };
  res.writeHead(206, headers);
  const videoStream = createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

app.listen(8058, () => {
  console.log("Listening on port 8058");
});
