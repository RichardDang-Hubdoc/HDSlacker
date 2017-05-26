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
const winreg = require("winreg");
class RegistryManager {
    static DeleteKey(hive, path) {
        return new Promise((resolve, reject) => {
            try {
                let regKey = new winreg({ hive: hive, key: path });
                regKey.keyExists((err, result) => {
                    if (!err && result) {
                        regKey.destroy((destroyErr) => {
                            if (destroyErr) {
                                reject(destroyErr);
                            }
                            else {
                                resolve(true);
                            }
                        });
                    }
                    resolve(true);
                });
            }
            catch (err) {
                reject(err);
            }
        }).then(undefined, err => { return undefined; });
    }
    static CreateKey(hive, path) {
        return new Promise((resolve, reject) => {
            try {
                let regKey = new winreg({ hive: hive, key: path });
                regKey.keyExists((err, result) => {
                    if (err || !result) {
                        regKey.create((err) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(true);
                            }
                        });
                    }
                    resolve(true);
                });
            }
            catch (err) {
                reject(err);
            }
        }).then(undefined, err => { return false; });
    }
    static SetStringValue(hive, path, name, value) {
        return new Promise((resolve, reject) => {
            try {
                let regKey = new winreg({ hive: hive, key: path });
                regKey.set(name, winreg.REG_SZ, value, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(true);
                    }
                });
            }
            catch (err) {
                reject(err);
            }
        }).then(undefined, err => { return false; });
    }
    // Add registry entries for the botemulator:// URI handler
    static RegisterProtocolHandler() {
        // Add registry entries for the botemulator:// URI handler
        return RegistryManager.DeleteKey(winreg.HKCU, '\\SOFTWARE\\Classes\\botemulator').then(_ => {
            return RegistryManager.CreateKey(winreg.HKCU, '\\SOFTWARE\\Classes\\botemulator');
        }).then(_ => {
            return RegistryManager.SetStringValue(winreg.HKCU, '\\SOFTWARE\\Classes\\botemulator', '', 'URL:Bot Emulator');
        }).then(_ => {
            return RegistryManager.SetStringValue(winreg.HKCU, '\\SOFTWARE\\Classes\\botemulator', 'URL Protocol', '');
        }).then(_ => {
            return RegistryManager.CreateKey(winreg.HKCU, '\\SOFTWARE\\Classes\\botemulator\\DefaultIcon');
        }).then(_ => {
            return RegistryManager.SetStringValue(winreg.HKCU, '\\SOFTWARE\\Classes\\botemulator\\DefaultIcon', '', process.execPath + ',1');
        }).then(_ => {
            return RegistryManager.CreateKey(winreg.HKCU, '\\SOFTWARE\\Classes\\botemulator\\shell');
        }).then(_ => {
            return RegistryManager.CreateKey(winreg.HKCU, '\\SOFTWARE\\Classes\\botemulator\\shell\\open');
        }).then(_ => {
            return RegistryManager.CreateKey(winreg.HKCU, '\\SOFTWARE\\Classes\\botemulator\\shell\\open\\command');
        }).then(_ => {
            return RegistryManager.SetStringValue(winreg.HKCU, '\\SOFTWARE\\Classes\\botemulator\\shell\\open\\command', '', '"' + process.execPath + '" "%1"');
        });
    }
    static UnregisterProtocolHandler() {
        return RegistryManager.DeleteKey(winreg.HKCU, '\\SOFTWARE\\Classes\\botemulator');
    }
}
exports.RegistryManager = RegistryManager;
//# sourceMappingURL=registrymanager.js.map