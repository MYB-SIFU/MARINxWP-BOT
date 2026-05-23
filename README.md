# MARINxWP

> Advanced WhatsApp Bot — Built by SIFAT ☠️

[![GitHub](https://img.shields.io/badge/GitHub-MYB--SIFU-blue?logo=github)](https://github.com/MYB-SIFU)
[![Repo](https://img.shields.io/badge/Repo-MARINxWP--BOT-green?logo=github)](https://github.com/MYB-SIFU/MARINxWP-BOT)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange)]()
[![Node](https://img.shields.io/badge/Node.js-20+-brightgreen?logo=node.js)]()
[![License](https://img.shields.io/badge/License-MIT-blue)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-99.9%25-yellow)]()

---

## ✨ Features

### 🤖 AI Chat
- **Multiple AI Models**: ChatGPT, Claude, Gemini, DeepSeek, Groq, Perplexity, Qwen, Copilot, Felo
- Intelligent conversation system with context awareness
- Real-time response handling

### 🎨 AI Generate
- **Image Generation**: Flux, MagicStudio, and more
- High-quality creative content generation
- Multiple style and format options

### 📥 Downloader
Supports downloading from:
- TikTok, YouTube, Instagram, Facebook
- Spotify, Twitter, Pinterest
- And many more platforms

### 👥 Group Management
- **Admin Tools**: Member management, role assignment
- **Auto Features**: Welcome/goodbye messages, auto-moderation
- **Safety**: Anti-spam, anti-link, anti-toxic filters
- **Warnings System**: Progressive user warnings and restrictions

### 🎮 Games
- Riddles and trivia challenges
- Word games and puzzles
- Interactive entertainment

### 💰 Economy System
- **Coins & Currency**: Earn and spend coins
- **Leveling**: User progression and ranks
- **Leaderboard**: Top performers tracking
- **Daily/Weekly/Monthly Claims**: Regular rewards

### 🔄 Converters
- Sticker converter (image to sticker)
- GIF, audio, video, and image conversion
- Quality preservation and format options

### 🛠️ Tools
- **OCR**: Image text recognition
- **Translation**: Multi-language support
- **Weather**: Real-time weather info
- **Lyrics**: Song lyrics finder
- **Screenshot**: URL/page capture
- **Religious**: Quran and Bible content
- And more utility tools

### 🛡️ Owner Panel
- **Broadcast**: Mass messaging system
- **User Management**: Ban/unban functionality
- **Premium**: Premium user management
- **Bot Control**: Bot mode toggling and settings

---

## 📁 Project Structure

```
MARINxWP-BOT/
├── marin.js                 # Main entry point
├── app.js                   # Express application
├── package.json             # Dependencies and scripts
├── config/
│   ├── default.json        # Default configuration
│   └── settings.json       # User configuration (edit this)
├── commands/
│   ├── cmd/                # Command handlers
│   └── event/              # Event handlers
├── src/
│   ├── handlers/           # Event and message handlers
│   └── utils/              # Utility functions
├── Dockerfile              # Docker configuration
└── railway.json            # Railway deployment config
```

---

## 🚀 Setup

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

Edit `config/settings.json` with your details:

```json
{
  "bot": {
    "name": "MARINxWP",
    "phoneNumber": "+1234567890"
  },
  "owner": {
    "name": "SIFAT",
    "id": "1234567890"
  },
  "system": {
    "usePairingCode": true,
    "customPairingCode": "MARINXWP"
  }
}
```

### 3. Run

```bash
npm start
```

The bot will display a QR code or pairing code. Scan with WhatsApp or enter the pairing code.

---

## 🌍 Deployment

### 🔴 Render

1. Fork this repository
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your forked repo
4. **Build Command**: `npm install`
5. **Start Command**: `node marin.js`
6. Deploy and scan the QR code or use pairing code
7. Keep your Render dyno active for continuous bot operation

### 🚂 Railway

1. Fork this repository
2. Create a new project on [railway.app](https://railway.app)
3. Connect your repo — Railway auto-detects `railway.json`
4. Set environment variables if needed
5. Deploy automatically

### 🐳 Docker

```bash
# Build the image
docker build -t marinxwp .

# Run the container
docker run -d -p 5000:5000 marinxwp

# Or with environment variables
docker run -d -p 5000:5000 -e PHONE_NUMBER="+1234567890" marinxwp
```

---

## ⚙️ Configuration

Edit `config/settings.json` to customize your bot:

| Key | Description | Default |
|-----|-------------|---------|
| `bot.name` | Bot display name | `MARINxWP` |
| `bot.phoneNumber` | Bot WhatsApp number | `""` |
| `owner.name` | Owner name | `SIFAT` |
| `owner.id` | Owner WhatsApp ID | — |
| `system.usePairingCode` | Use pairing code instead of QR | `false` |
| `system.customPairingCode` | 6-8 character pairing code | `MARINXWP` |
| `system.antiCall` | Auto-ban call initiators | `true` |
| `system.antiBug` | Auto-ban suspicious users | `true` |
| `system.useCoin` | Enable economy system | `true` |
| `system.port` | Health check server port | `5000` |
| `system.timeZone` | Bot timezone | `Asia/Dhaka` |

---

## 📦 Dependencies

- **axios** - HTTP requests
- **axios-retry** - Automatic retry logic
- **jimp** - Image processing
- **wa-sticker-formatter** - WhatsApp sticker creation
- **cfonts** - Beautiful console fonts
- **moment-timezone** - Timezone handling
- **link-preview-js** - Link preview generation
- **@itsreimau/gktw** - GKTW API integration
- **@ginkohub/speedtest-js** - Speed testing

---

## 🎯 Commands

The bot responds to various commands. Use the prefix configured in your settings to trigger commands:

```
.help              - Show all available commands
.ai <question>     - Ask AI assistant
.play <song>       - Download music
.sticker <image>   - Convert image to sticker
.weather <city>    - Get weather info
.translate <text>  - Translate text
```

Full command list available after deployment.

---

## 👨‍💻 Developer

**SIFAT**
- GitHub: [@MYB-SIFU](https://github.com/MYB-SIFU)
- Bot Repository: [MARINxWP-BOT](https://github.com/MYB-SIFU/MARINxWP-BOT)

---

## ⚠️ Important Notes

- **Legal**: This bot is for educational purposes. Use responsibly and follow WhatsApp's Terms of Service
- **Rate Limiting**: Some features may have API rate limits
- **Stability**: Keep your deployment service active for continuous operation
- **Privacy**: Never share your pairing code or session files
- **Updates**: Check for updates regularly

---

## 📄 License

MIT © 2024 SIFAT

---

## 🤝 Support

For issues, suggestions, or contributions, please visit the [GitHub repository](https://github.com/MYB-SIFU/MARINxWP-BOT).

