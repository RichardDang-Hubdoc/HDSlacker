//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Bot Framework: http://botframework.com
//
// Bot Framework Emulator Github:
// https://github.com/Microsoft/BotFramwork-Emulator
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Electron = require("electron");
const electron_1 = require("electron");
const settings_1 = require("./settings");
const WinSquirrelStartupEventHandler_1 = require("./WinSquirrelStartupEventHandler");
const AppUpdater_1 = require("./AppUpdater");
var pjson = require('../../package.json');
const url = require("url");
const path = require("path");
const log = require("./log");
const emulator_1 = require("./emulator");
const windowManager_1 = require("./windowManager");
var pjson = require('../../package.json');
process.on('uncaughtException', (error) => {
    console.error(error);
    log.error('[err-server]', error.message.toString(), JSON.stringify(error.stack));
});
var openUrls = [];
var onOpenUrl = function (event, url) {
    event.preventDefault();
    if (process.platform === 'darwin') {
        if (exports.mainWindow && exports.mainWindow.webContents) {
            // the app is already running, send a message containing the url to the renderer process
            exports.mainWindow.webContents.send('botemulator', url);
        }
        else {
            // the app is not yet running, so store the url so the UI can request it later
            openUrls.push(url);
        }
    }
};
Electron.app.on('will-finish-launching', (event, args) => {
    Electron.ipcMain.on('getUrls', (event, arg) => {
        openUrls.forEach(url => exports.mainWindow.webContents.send('botemulator', url));
        openUrls = [];
    });
    // On Mac, a protocol handler invocation sends urls via this event
    Electron.app.on('open-url', onOpenUrl);
});
const createMainWindow = () => {
    if (WinSquirrelStartupEventHandler_1.default()) {
        return;
    }
    const windowTitle = "Bot Framework Channel Emulator";
    // TODO: Make a better/safer window state restoration module
    // (handles change in display dimensions, maximized state, etc)
    const safeLowerBound = (val, lowerBound) => {
        if (typeof (val) === 'number') {
            return Math.max(lowerBound, val);
        }
    };
    const settings = settings_1.getSettings();
    exports.mainWindow = new Electron.BrowserWindow({
        show: false,
        backgroundColor: '#f7f7f7',
        width: safeLowerBound(settings.windowState.width, 0),
        height: safeLowerBound(settings.windowState.height, 0),
        x: safeLowerBound(settings.windowState.left, 0),
        y: safeLowerBound(settings.windowState.top, 0),
        webPreferences: {
            directWrite: false
        }
    });
    exports.mainWindow.setTitle(windowTitle);
    exports.windowManager = new windowManager_1.WindowManager();
    // Will not run until window is ready to show
    new AppUpdater_1.default(exports.mainWindow);
    //mainWindow.webContents.openDevTools();
    if (process.platform === 'darwin') {
        // Create the Application's main menu
        var template = [
            {
                label: windowTitle,
                submenu: [
                    { label: "About", click: () => emulator_1.Emulator.send('show-about') },
                    { type: "separator" },
                    { label: "Quit", accelerator: "Command+Q", click: () => Electron.app.quit() }
                ]
            }, {
                label: "Edit",
                submenu: [
                    { label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo" },
                    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
                    { type: "separator" },
                    { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
                    { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
                    { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
                    { label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectall" }
                ]
            }
        ];
        electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(template));
    }
    else {
        electron_1.Menu.setApplicationMenu(null);
    }
    exports.mainWindow.on('resize', () => {
        const bounds = exports.mainWindow.getBounds();
        settings_1.dispatch({
            type: 'Window_RememberBounds',
            state: {
                width: bounds.width,
                height: bounds.height,
                left: bounds.x,
                top: bounds.y
            }
        });
    });
    exports.mainWindow.on('move', () => {
        const bounds = exports.mainWindow.getBounds();
        settings_1.dispatch({
            type: 'Window_RememberBounds',
            state: {
                width: bounds.width,
                height: bounds.height,
                left: bounds.x,
                top: bounds.y
            }
        });
    });
    exports.mainWindow.on('closed', function () {
        exports.windowManager.closeAll();
        exports.mainWindow = null;
    });
    exports.mainWindow.once('ready-to-show', () => {
        exports.mainWindow.show();
    });
    // On Mac, a protocol handler invocation sends urls via this event
    Electron.app.on('open-url', (event, url) => {
        console.log('open-url: ' + url);
        if (exports.mainWindow) {
            // the app is already running, send a message containing the url to the renderer process
            exports.mainWindow.webContents.send('botemulator', url);
        }
    });
    let queryString = '';
    if (process.argv[1] && process.argv[1].indexOf('botemulator') !== -1) {
        // add a query string with the botemulator protocol handler content
        queryString = '?' + process.argv[1];
    }
    let page = url.format({
        protocol: 'file',
        slashes: true,
        pathname: path.join(__dirname, '../client/index.html')
    });
    if (queryString) {
        page = page + queryString;
    }
    exports.mainWindow.loadURL(page);
};
emulator_1.Emulator.startup();
Electron.app.on('ready', createMainWindow);
Electron.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        Electron.app.quit();
    }
});
Electron.app.on('activate', function () {
    if (exports.mainWindow === null) {
        createMainWindow();
    }
});
// Do this last, otherwise startup bugs are harder to diagnose.
require('electron-debug')();
//# sourceMappingURL=main.js.map