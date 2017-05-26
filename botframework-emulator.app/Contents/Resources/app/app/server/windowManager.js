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
const URL = require("url");
const path = require("path");
class WindowManager {
    constructor() {
        this.windows = [];
        Electron.ipcMain.on('createCheckoutWindow', (event, args) => {
            this.createCheckoutWindow(args.payload, args.settings, args.serviceUrl);
        });
        Electron.ipcMain.on('getCheckoutState', (event, args) => {
            let state = event.sender['checkoutState'];
            event.returnValue = state;
        });
    }
    addMainWindow(window) {
        this.mainWindow = window;
    }
    hasMainWindow() {
        return this.mainWindow !== undefined;
    }
    getMainWindow() {
        return this.mainWindow;
    }
    add(window) {
        this.windows.push(window);
    }
    remove(window) {
        let idx = this.windows.indexOf(window);
        if (idx !== -1) {
            this.windows.splice(idx, 1);
        }
    }
    createCheckoutWindow(payload, settings, serviceUrl) {
        let page = URL.format({
            protocol: 'file',
            slashes: true,
            pathname: path.join(__dirname, '../client/payments/index.html')
        });
        page += '?' + payload;
        let checkoutWindow = new Electron.BrowserWindow({
            width: 1000,
            height: 620,
            title: 'Checkout with Microsoft Emulator'
        });
        this.add(checkoutWindow);
        checkoutWindow.webContents['checkoutState'] = {
            settings: settings,
            serviceUrl: serviceUrl
        };
        checkoutWindow.on('closed', () => {
            this.remove(checkoutWindow);
        });
        // checkoutWindow.webContents.openDevTools();
        // Load a remote URL
        checkoutWindow.loadURL(page);
    }
    closeAll() {
        let openWindows = [];
        this.windows.forEach(win => openWindows.push(win));
        openWindows.forEach(win => win.close());
        this.windows = [];
        this.mainWindow = undefined;
    }
}
exports.WindowManager = WindowManager;
//# sourceMappingURL=windowManager.js.map