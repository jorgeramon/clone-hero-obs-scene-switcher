const logger = require("./logger");
logger.info(
  "================================== [ START ] =================================="
);

const { SCENE_MENU, SCENE_GAMEPLAY, CLONE_HERO_FOLDER } = require("./config");
const { pressAnyKeyAndExit } = require("./std-in");

const fs = require("fs");
const OBSWebSocket = require("obs-websocket-js");
const { Observable } = require("rxjs");

const obs = new OBSWebSocket();
const CURRENT_SONG_PATH = `${CLONE_HERO_FOLDER}\\currentsong.txt`;

async function main() {
  await connect();
  startWatchingChanges();
}

async function fileExists(file) {
  return new Promise(function (resolve, reject) {
    fs.access(file, fs.constants.F_OK, (err) =>
      err ? reject(err) : resolve()
    );
  });
}

function watchFile(file) {
  return new Observable(function (subscriber) {
    fs.watchFile(file, function (current) {
      subscriber.next(current);
    });
  });
}

async function connect() {
  logger.info("Looking for currentsong.txt file...");

  try {
    await fileExists(CURRENT_SONG_PATH);
    logger.info(`File located in ${CURRENT_SONG_PATH}`);
  } catch (e) {
    logger.error(
      `File currentsong.txt doesn\'t exist. Are you sure that ${CLONE_HERO_FOLDER} contains the file?`
    );
    await pressAnyKeyAndExit();
  }

  logger.info("Trying to connect to OBS...");

  try {
    await obs.connect();
    logger.info("Connected to OBS");
  } catch (e) {
    logger.error(
      "Couldn't connect to OBS. Are you sure that obs-websocket-plugin is installed?"
    );
    await pressAnyKeyAndExit();
  }
}

function startWatchingChanges() {
  watchFile(CURRENT_SONG_PATH).subscribe(async function (current) {
    if (current.size === 0) {
      logger.info(`Switching scene to ${SCENE_MENU}`);
      await obs.send("SetCurrentScene", { "scene-name": SCENE_MENU });
    } else {
      logger.info(`Switching scene to ${SCENE_GAMEPLAY}`);
      await obs.send("SetCurrentScene", { "scene-name": SCENE_GAMEPLAY });
    }
  });
}

main();
