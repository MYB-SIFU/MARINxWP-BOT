# MARINxWP

> Advanced WhatsApp Bot — Built by SIFAT

[![GitHub](https://img.shields.io/badge/GitHub-MYB--SIFU-blue?logo=github)](https://github.com/MYB-SIFU)
[![Repo](https://img.shields.io/badge/Repo-MARINxWP--BOT-green?logo=github)](https://github.com/MYB-SIFU/MARINxWP-BOT)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange)]()
[![Node](https://img.shields.io/badge/Node.js-20+-brightgreen?logo=node.js)]()

---

## Features

- **AI Chat** — ChatGPT, Claude, Gemini, DeepSeek, Groq, Perplexity, Qwen, Copilot, Felo
- **AI Generate** — Image generation with Flux, MagicStudio, and more
- **Downloader** — TikTok, YouTube, Instagram, Facebook, Spotify, Twitter, Pinterest, and more
- **Group Management** — Admin tools, welcome/goodbye, anti-spam, anti-link, anti-toxic, warnings
- **Games** — Riddles, trivia, word games, and more
- **Economy** — Coins, leveling system, leaderboard, daily/weekly/monthly claims
- **Converters** — Sticker, GIF, audio, video, image conversion
- **Tools** — OCR, translate, weather, lyrics, screenshot, Quran, Bible, and more
- **Owner Panel** — Broadcast, ban/unban, premium management, bot mode control

---

## Project Structure



---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/MYB-SIFU/MARINxWP-BOT
cd MARINxWP-BOT
npm install
```

### 2. Configure

```bash
cp config/default.json config/settings.json
```

Edit `config/settings.json` and set your phone number and owner info.

### 3. Run

```bash
npm start
```

---

## Deployment

### Render

1. Fork this repository
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your forked repo
4. Build Command: `npm install`
5. Start Command: `node app.js`
6. Deploy and scan the QR code or use pairing code

### Railway

1. Fork this repository
2. Create a new project on [railway.app](https://railway.app)
3. Connect your repo — Railway auto-detects `railway.json`
4. Deploy

### Docker

```bash
docker build -t marinxwp .
docker run -d -p 5000:5000 marinxwp
```

---

## Configuration

Edit `config/settings.json`:

| Key | Description | Default |
|-----|-------------|---------|
| `bot.name` | Bot display name | `MARINxWP` |
| `bot.phoneNumber` | Bot WhatsApp number | `""` |
| `owner.name` | Owner name | `SIFAT` |
| `owner.id` | Owner phone number | — |
| `system.usePairingCode` | Use pairing code instead of QR | `false` |
| `system.customPairingCode` | Custom 8-char pairing code | `MARINXWP` |
| `system.antiCall` | Auto-ban callers | `true` |
| `system.antiBug` | Auto-ban bug attackers | `true` |
| `system.useCoin` | Enable coin economy | `true` |
| `system.port` | Health server port | `5000` |
| `system.timeZone` | Bot timezone | `Asia/Dhaka` |

---

## Developer

**SIFAT**
- GitHub: [github.com/MYB-SIFU](https://github.com/MYB-SIFU)
- Bot Repo: [github.com/MYB-SIFU/MARINxWP-BOT](https://github.com/MYB-SIFU/MARINxWP-BOT)

---

## License

MIT © 2024 SIFAT
