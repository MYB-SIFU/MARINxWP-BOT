const util = require("node:util");

const RAW_URL = "https://raw.githubusercontent.com/MYB-SIFU/SIFATChudtese/refs/heads/main/dhn/img-apis.json";

let APIs = {
    delirius: { baseURL: "https://api.delirius.store" },
    faaa: { baseURL: "https://api-faa.my.id" },
    kuroneko: { baseURL: "https://api.danzy.web.id" },
    lexcode: { baseURL: "https://api.lexcode.biz.id" },
    nekolabs: { baseURL: "https://rynekoo-api.hf.space" },
    neo: { baseURL: "https://www.neoapis.xyz" },
    nexray: { baseURL: "https://api.nexray.eu.cc" },
    omegatech: { baseURL: "https://omegatech-api.dixonomega.tech" },
    sanka: { baseURL: "https://www.sankavolereii.my.id", APIKey: "planaai" },
    siputzx: { baseURL: "https://api.siputzx.my.id" }
};

async function init() {
    try {
        const response = await axios.get(RAW_URL);
        const data = response.data;
        const result = {};
        let lastKey = null;
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === "string" && /^https?:\/\//.test(value)) {
                result[key] = { baseURL: value };
                lastKey = key;
            } else if (key === "APIKey" && lastKey && result[lastKey]) {
                result[lastKey].APIKey = value;
            }
        }
        if (Object.keys(result).length > 0) {
            APIs = result;
            consolefy.success(`API list loaded: ${Object.keys(result).length} APIs available.`);
        }
    } catch (error) {
        consolefy.warn(`Remote API list unavailable, using fallback. (${error.message})`);
    }
}

function createUrl(apiNameOrURL, endpoint, params = {}, apiKeyParamName) {
    try {
        const api = APIs[apiNameOrURL];
        if (!api) {
            const url = new URL(apiNameOrURL);
            apiNameOrURL = url;
        }

        const queryParams = new URLSearchParams(params);
        if (apiKeyParamName && api && "APIKey" in api) queryParams.set(apiKeyParamName, api.APIKey);

        const baseURL = api ? api.baseURL : apiNameOrURL.origin;
        const apiUrl = new URL(endpoint, baseURL);
        apiUrl.search = queryParams.toString();

        return apiUrl.toString();
    } catch (error) {
        consolefy.error(`API URL error: ${util.format(error)}`);
        return null;
    }
}

function listUrl() {
    return APIs;
}

module.exports = { init, createUrl, listUrl };
