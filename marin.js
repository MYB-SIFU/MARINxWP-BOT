require("node:process").loadEnvFile();
const { Config, Consolefy, Formatter } = require("@itsreimau/gktw");
const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const path = require("node:path");
const pkg = require("./package.json");
const CFonts = require("cfonts");
const http = require("node:http");
const { getHTML } = require("./src/web/status.js");

axiosRetry(axios, {
    retries: 3,
    retryCondition: (error) => {
        const status = error.response?.status;
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || status === 408 || status === 429;
    }
});

Object.assign(global, {
    axios,
    config: new Config(path.resolve(__dirname, "config/settings.json")),
    consolefy: new Consolefy({ tag: pkg.name }),
    formatter: Formatter,
    tools: require("./src/utils/index.js")
});

consolefy.log("Starting...");

CFonts.say(pkg.name, {
    colors: ["#00A1E0", "#00FFFF"],
    align: "center"
});
CFonts.say(`${pkg.description} - By ${pkg.author}`, {
    font: "console",
    colors: ["#E0F7FF"],
    align: "center"
});

const port = config.system?.port || 5000;
const startTime = Date.now();

const server = http.createServer((req, res) => {
    const url = req.url?.split("?")[0];
    if (url === "/api/status") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            status: "alive",
            bot: pkg.name,
            version: pkg.version,
            uptime: process.uptime()
        }));
    } else {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(getHTML(pkg, startTime));
    }
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        consolefy.warn(`Port ${port} in use, retrying in 3s...`);
        setTimeout(() => server.listen(port, "0.0.0.0"), 3000);
    } else {
        consolefy.error(`Server error: ${err.message}`);
    }
});

server.listen(port, "0.0.0.0", () => {
    consolefy.success(`${pkg.name} health server running on port ${port}`);
});

(async () => {
    await tools.api.init();
    require("./src/core/sifat.js");
})();
