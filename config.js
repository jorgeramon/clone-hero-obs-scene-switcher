const logger = require("./logger");
const ini = require("multi-ini");

logger.info("Reading setttings.ini file...");

function loadConfig() {
  try {
    const content = ini.read("./settings.ini", { encoding: "utf-8" });
    return {
      SCENE_MENU: content.obs.scene_menu,
      SCENE_GAMEPLAY: content.obs.scene_gameplay,
      CLONE_HERO_FOLDER: content.clonehero.folder,
    };
  } catch (e) {
    logger.error("Cannot find settings.init file or it has an invalid format");
    process.exit(1);
  }
}

module.exports = loadConfig();
