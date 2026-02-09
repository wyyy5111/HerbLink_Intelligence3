import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const regions = [
  { location: "安国药市", spec: "家种统片", origin: "广东", price: 26, change: -14.0 },
  { location: "安国药市", spec: "野生统片", origin: "较广", price: 26, change: -14.0 },
  { location: "亳州药市", spec: "家种统片", origin: "广东", price: 27, change: -11.0 },
  { location: "亳州药市", spec: "野生统片", origin: "较广", price: 25, change: -10.0 },
  { location: "亳州药市", spec: "家种统片", origin: "安徽", price: 28, change: -12.0 },
  { location: "荷花池药市", spec: "家统片", origin: "较广", price: 24, change: -16.0 },
  { location: "玉林药市", spec: "家种统片", origin: "广东", price: 22, change: -16.0 },
  { location: "玉林药市", spec: "野生统片", origin: "较广", price: 28, change: -11.0 },
  { location: "广东省-茂名市-高州市", spec: "家种统片", origin: "", price: 20, change: -14.0 },
  { location: "贵州省-毕节地区-毕节市", spec: "野生统片", origin: "", price: 25, change: -11.0 },
  { location: "四川省-攀枝花市-盐边县", spec: "野生统片", origin: "", price: 26, change: -11.0 },
  { location: "云南省-丽江市-华坪县", spec: "野生统片", origin: "", price: 24, change: -10.0 }
];

const marketBase = regions.map((item) => item.price);
const volumeBase = [8.6, 8.2, 7.9, 8.1, 7.6, 7.2, 6.9, 7.1, 6.7, 6.8, 6.9, 7.0];

const marketHistory = [
  { year: 2021, avg: 34.8, high: 37.5, low: 31.6 },
  { year: 2022, avg: 32.9, high: 35.2, low: 30.5 },
  { year: 2023, avg: 31.2, high: 33.8, low: 28.8 },
  { year: 2024, avg: 29.4, high: 32.0, low: 27.1 },
  { year: 2025, avg: 27.8, high: 30.1, low: 25.4 },
  { year: 2026, avg: 25.5, high: 28.0, low: 22.8 }
];

const metrics = {
  coverage: 180,
  herbs: 360,
  trace: 120000,
  matchRate: 96,
  quality: 99.2
};

app.use(express.static(__dirname));

app.get("/api/metrics", (req, res) => {
  res.json(metrics);
});

app.get("/api/market", (req, res) => {
  const range = Number(req.query.range || 12);
  const slice = marketBase.slice(0, Math.min(range, marketBase.length));
  const volumeSlice = volumeBase.slice(0, Math.min(range, volumeBase.length));
  const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
  const max = Math.max(...slice);
  const min = Math.min(...slice);
  res.json({
    range: slice.length,
    price: slice,
    volume: volumeSlice,
    history: marketHistory,
    summary: {
      avg: Number(avg.toFixed(2)),
      max,
      min,
      volumePeak: Math.max(...volumeSlice)
    }
  });
});

app.get("/api/regions", (req, res) => {
  res.json({ regions });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    res.status(404).end();
    return;
  }
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`🌟 本草智链展示平台启动成功！`);
  console.log(`🌐 访问地址: http://localhost:${port}`);
  console.log(`📊 中药材全产业链互联网平台已就绪！`);
});
