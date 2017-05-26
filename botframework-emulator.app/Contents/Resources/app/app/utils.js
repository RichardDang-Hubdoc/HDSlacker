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
const Fs = require("fs");
const Mkdirp = require("mkdirp");
const url = require("url");
/**
 * Generates a random id that is unique enough for our purposes.
 */
exports.uniqueId = (length) => Math.random().toString(24).substr(2, length);
const ensureStoragePath = () => {
    const app = Electron.app || Electron.remote.app;
    const USER_DATA_PATH = app.getPath('userData');
    const path = `${USER_DATA_PATH}/botframework-emulator`;
    Mkdirp.sync(path);
    return path;
};
/**
 * Load JSON object from file.
 */
exports.loadSettings = (filename, defaultSettings) => {
    try {
        filename = `${ensureStoragePath()}/${filename}`;
        const stat = Fs.statSync(filename);
        if (stat.isFile()) {
            const loaded = JSON.parse(Fs.readFileSync(filename, 'utf8'));
            return mergeDeep(defaultSettings, loaded);
        }
        return defaultSettings;
    }
    catch (e) {
        console.error(`Failed to read file: ${filename}`, e);
        return defaultSettings;
    }
};
/**
 * Save JSON object to file.
 */
exports.saveSettings = (filename, settings) => {
    try {
        filename = `${ensureStoragePath()}/${filename}`;
        Fs.writeFileSync(filename, JSON.stringify(settings, null, 2), 'utf8');
    }
    catch (e) {
        console.error(`Failed to write file: ${filename}`, e);
    }
};
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}
exports.isObject = isObject;
function mergeDeep(target, source) {
    let output = Object.assign({}, target);
    //if (isObject(target) && isObject(source)) {
    {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}
exports.mergeDeep = mergeDeep;
exports.isLocalhostUrl = (urlStr) => {
    const parsedUrl = url.parse(urlStr);
    return (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1');
};
exports.isSecuretUrl = (urlStr) => {
    const parsedUrl = url.parse(urlStr);
    return (parsedUrl.protocol.startsWith('https'));
};
exports.safeStringify = (o, space = undefined) => {
    let cache = [];
    if (typeof o !== 'object')
        return `${o}`;
    return JSON.stringify(o, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                return;
            }
            cache.push(value);
        }
        return value;
    }, space);
};
//# sourceMappingURL=utils.js.map