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
const React = require("react");
const Constants = require("../constants");
const reducers_1 = require("../reducers");
const settings_1 = require("../settings");
var pjson = require('../../../package.json');
class AboutDialog extends React.Component {
    constructor() {
        super(...arguments);
        this.pageClicked = (ev) => {
            if (ev.defaultPrevented)
                return;
            let target = ev.srcElement;
            while (target) {
                if (target.className.toString().includes("about")) {
                    ev.preventDefault();
                    return;
                }
                target = target.parentElement;
            }
            // Click was outside the dialog. Close.
            this.onClose();
        };
        this.onClose = () => {
            reducers_1.AddressBarActions.hideAbout();
        };
    }
    componentWillMount() {
        window.addEventListener('click', this.pageClicked);
        this.settingsUnsubscribe = settings_1.addSettingsListener((settings) => {
            if (settings.addressBar.showAbout != this.showing) {
                this.showing = settings.addressBar.showAbout;
                this.forceUpdate();
            }
        });
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.pageClicked);
        this.settingsUnsubscribe();
    }
    render() {
        const settings = settings_1.getSettings();
        if (!settings.addressBar.showAbout)
            return null;
        return (React.createElement("div", null,
            React.createElement("div", { className: "dialog-background" }),
            React.createElement("div", { className: "emu-dialog about-dialog" },
                React.createElement("div", { className: "dialog-closex", onClick: () => this.onClose(), dangerouslySetInnerHTML: { __html: Constants.clearCloseIcon("", 24) } }),
                React.createElement("div", { className: 'about-logo', dangerouslySetInnerHTML: { __html: Constants.botFrameworkIcon('about-logo-fill', 142) } }),
                React.createElement("div", { className: "about-name" }, "Microsoft Bot Framework Emulator"),
                React.createElement("div", { className: "about-link" },
                    React.createElement("a", { href: 'https://aka.ms/bf-emulator' }, "https://aka.ms/bf-emulator")),
                React.createElement("div", { className: "about-version" }, `v${pjson.version}`),
                React.createElement("div", { className: "about-copyright" }, "\u00A9 2016 Microsoft"))));
    }
}
exports.AboutDialog = AboutDialog;
//# sourceMappingURL=aboutDialog.js.map