"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const child_process_1 = require("child_process");
const path = require("path");
const registrymanager_1 = require("./registrymanager");
//import * as logger from './log';
function run(args, done) {
    const updateExe = path.resolve(path.dirname(process.execPath), "..", "Update.exe");
    //logger.log(`Spawning ${updateExe} with args ${args}`);
    child_process_1.spawn(updateExe, args, {
        detached: true
    })
        .on("close", done);
}
function handleStartupEvent() {
    if (process.platform !== "win32") {
        return false;
    }
    const cmd = process.argv[1];
    //logger.log(`Processing squirrel command ${cmd}`);
    const target = path.basename(process.execPath);
    if (cmd === "--squirrel-install" || cmd === "--squirrel-updated") {
        registrymanager_1.RegistryManager.RegisterProtocolHandler().then(_ => {
            run(['--createShortcut=' + target + ''], electron_1.app.quit);
        });
        return true;
    }
    else if (cmd === "--squirrel-uninstall") {
        registrymanager_1.RegistryManager.UnregisterProtocolHandler().then(_ => {
            run(['--removeShortcut=' + target + ''], electron_1.app.quit);
        });
        return true;
    }
    else if (cmd === "--squirrel-obsolete") {
        electron_1.app.quit();
        return true;
    }
    else {
        return false;
    }
}
exports.default = handleStartupEvent;
//# sourceMappingURL=WinSquirrelStartupEventHandler.js.map