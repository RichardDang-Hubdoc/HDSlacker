"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const os = require("os");
var pjson = require('../../package.json');
const logger = require("./log");
class AppUpdater {
    constructor(window) {
        const version = electron_1.app.getVersion();
        electron_1.autoUpdater.addListener("update-available", (event) => {
            logger.debug("A new version is available. Downloading it now. You will be notified when download completes.");
        });
        electron_1.autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
            logger.debug("Download complete.", logger.makeCommandLink("Restart", 'autoUpdater.quitAndInstall', "Quit and install the update"), "the application to update.");
        });
        electron_1.autoUpdater.addListener("error", (error) => {
            //logger.error(error.message, error);
        });
        electron_1.autoUpdater.addListener("checking-for-update", (event) => {
            logger.debug("Checking for new version...");
        });
        electron_1.autoUpdater.addListener("update-not-available", () => {
            logger.debug("Application is up to date.");
        });
        electron_1.autoUpdater.setFeedURL(`https://${pjson.build.nutsServer}/update/${os.platform()}/${version}`);
        window.once("ready-to-show", (event) => {
            try {
                electron_1.autoUpdater.checkForUpdates();
            }
            catch (e) { }
        });
    }
}
exports.default = AppUpdater;
//# sourceMappingURL=AppUpdater.js.map