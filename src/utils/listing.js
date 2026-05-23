const api = require("./api.js");
const util = require("node:util");

async function get(type) {
    try {
        let text = "";
        const createList = (data, list) => data.map(list).join("\n");

        switch (type) {
            case "alkitab": {
                const data = (await axios.get(api.createUrl("https://api-alkitab.vercel.app", "/api/book"))).data.data;
                text = createList(data, (list) =>
                    `➛ ${formatter.bold("Book")}: ${list.name} (${list.abbr})\n` +
                    `➛ ${formatter.bold("Chapters")}: ${list.chapter}`
                );
                break;
            }
            case "alquran": {
                const data = (await axios.get(api.createUrl("https://raw.githubusercontent.com", "/penggguna/QuranJSON/master/quran.json"))).data;
                text = createList(data, (list) =>
                    `➛ ${formatter.bold("Surah")}: ${list.name} (${list.number_of_surah})\n` +
                    `➛ ${formatter.bold("Verses")}: ${list.number_of_ayah}`
                );
                break;
            }
            case "claim": {
                const data = [
                    "daily (Daily reward)",
                    "weekly (Weekly reward)",
                    "monthly (Monthly reward)",
                    "yearly (Yearly reward)"
                ];
                text = createList(data, (list) => `➛ ${list}`);
                break;
            }
            case "group": {
                const data = [
                    "open (Open group)",
                    "close (Close group)",
                    "lock (Lock group)",
                    "unlock (Unlock group)",
                    "approve (Enable join approval)",
                    "disapprove (Disable join approval)",
                    "invite (Allow members to add members)",
                    "restrict (Only admins can add members)"
                ];
                text = createList(data, (list) => `➛ ${list}`);
                break;
            }
            case "mode": {
                const data = [
                    "premium (Premium mode - only responds to premium users and owner)",
                    "group (Group mode - only responds in groups)",
                    "private (Private mode - only responds in private chat)",
                    "public (Public mode - responds in groups and private chat)",
                    "self (Self mode - only responds to itself and owner)"
                ];
                text = createList(data, (list) => `➛ ${list}`);
                break;
            }
            case "osettext": {
                const data = [
                    "donate - Variables: %tag%, %name%, %prefix%, %command%, %footer%, %readmore% (Set donate text)",
                    "price - Variables: %tag%, %name%, %prefix%, %command%, %footer%, %readmore% (Set price text)",
                    "qris (Set QRIS image for donations, must be a URL)"
                ];
                text = createList(data, (list) => `➛ ${list}`);
                break;
            }
            case "setoption": {
                const data = [
                    "antiaudio (Anti audio)",
                    "antidocument (Anti document)",
                    "antiimage (Anti image)",
                    "antisticker (Anti sticker)",
                    "antivideo (Anti video)",
                    "antigcsw (Anti group status)",
                    "antilink (Anti link)",
                    "antispam (Anti spam)",
                    "antitagsw (Anti tag status)",
                    "antitoxic (Anti toxic language)",
                    `autokick (Auto kick when violating any ${formatter.inlineCode("anti...")} option)`,
                    "gamerestrict (Restrict game commands for members)",
                    "welcome (Welcome new members)"
                ];
                text = createList(data, (list) => `➛ ${list}`);
                break;
            }
            case "setprofile": {
                const data = [
                    "autolevelup (Auto level-up notification)",
                    "stickerwm (Sticker watermark)"
                ];
                text = createList(data, (list) => `➛ ${list}`);
                break;
            }
            case "settext": {
                const data = [
                    "goodbye (Goodbye text - variables: %tag%, %subject%, %description%)",
                    "intro (Group introduction text)",
                    "welcome (Welcome text - variables: %tag%, %subject%, %description%)"
                ];
                text = createList(data, (list) => `➛ ${list}`);
                break;
            }
            default: {
                text = tools.msg.info(`Unknown type: ${type}`);
                break;
            }
        }

        return text;
    } catch (error) {
        consolefy.error(`Listing error: ${util.format(error)}`);
        return null;
    }
}

module.exports = { get };
