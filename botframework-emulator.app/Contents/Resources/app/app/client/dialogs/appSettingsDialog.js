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
const electron_1 = require("electron");
const settings_1 = require("../settings");
const reducers_1 = require("../reducers");
const path = require("path");
const Constants = require("../constants");
class AppSettingsDialog extends React.Component {
    constructor() {
        super(...arguments);
        this.pageClicked = (ev) => {
            if (ev.defaultPrevented)
                return;
            let target = ev.srcElement;
            while (target) {
                if (target.className.toString().includes("appsettings")) {
                    return;
                }
                target = target.parentElement;
            }
            // Click was outside the dialog. Close.
            this.onClose();
        };
        this.onAccept = () => {
            reducers_1.ServerSettingsActions.remote_setFrameworkServerSettings({
                ngrokPath: this.ngrokPathInputRef.value,
                bypassNgrokLocalhost: this.bypassNgrokLocalhostInputRef.checked
            });
            reducers_1.AddressBarActions.hideAppSettings();
        };
        this.onClose = () => {
            reducers_1.AddressBarActions.hideAppSettings();
        };
        this.browseForNgrokPath = () => {
            const dir = path.dirname(this.ngrokPathInputRef.value);
            electron_1.remote.dialog.showOpenDialog(electron_1.remote.getCurrentWindow(), {
                title: 'Browse for ngrok',
                defaultPath: dir,
                properties: ['openFile']
            }, (filenames) => {
                if (filenames && filenames.length) {
                    // TODO: validate selection
                    this.ngrokPathInputRef.value = filenames[0];
                    this.setState({ ngrokPath: filenames[0] });
                }
            });
        };
    }
    componentWillMount() {
        window.addEventListener('click', this.pageClicked);
        this.settingsUnsubscribe = settings_1.addSettingsListener((settings) => {
            if (settings.addressBar.showAppSettings != this.showing) {
                this.showing = settings.addressBar.showAppSettings;
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
        if (!settings.addressBar.showAppSettings)
            return null;
        const serverSettings = settings_1.getSettings().serverSettings;
        return (React.createElement("div", null,
            React.createElement("div", { className: "dialog-background" }),
            React.createElement("div", { className: "emu-dialog appsettings-dialog" },
                React.createElement("h2", { className: "dialog-header" }, "App Settings"),
                React.createElement("div", { className: "dialog-closex", onClick: () => this.onClose(), dangerouslySetInnerHTML: { __html: Constants.clearCloseIcon("", 24) } }),
                React.createElement("div", { className: "appsettings-lowerpane" },
                    React.createElement("ul", { className: "emu-navbar" },
                        React.createElement("li", null,
                            React.createElement("a", { href: "javascript:void(0)", className: "emu-navitem emu-navitem-selected" }, "ngrok"))),
                    React.createElement("hr", { className: 'enu-navhdr' }),
                    React.createElement("div", { className: "emu-tab emu-visible" },
                        React.createElement("div", { className: 'emu-dialog-text' },
                            React.createElement("a", { title: 'https://ngrok.com', href: 'https://ngrok.com' }, "ngrok"),
                            " is network tunneling software. The Bot Framework Emulator works with ngrok to communicate with bots hosted remotely. Read the ",
                            React.createElement("a", { title: 'https://github.com/Microsoft/BotFramework-Emulator/wiki/Tunneling-(ngrok)', href: 'https://aka.ms/szvi68' }, "wiki page"),
                            " to learn more about using ngrok and to download it."),
                        React.createElement("div", { className: "input-group" },
                            React.createElement("label", { className: "form-label" }, "Path to ngrok:"),
                            React.createElement("input", { type: "text", ref: ref => this.ngrokPathInputRef = ref, className: "form-input appsettings-path-input appsettings-ngrokpath-input", defaultValue: `${serverSettings.framework.ngrokPath || ''}`, onChange: (elem) => this.setState({ ngrokPath: elem.currentTarget.value }) }),
                            React.createElement("button", { className: 'appsettings-browsebtn', onClick: () => this.browseForNgrokPath() }, "Browse...")),
                        React.createElement("div", { className: "input-group appsettings-checkbox-group" },
                            React.createElement("label", { className: "form-label clickable" },
                                React.createElement("input", { type: "checkbox", ref: ref => this.bypassNgrokLocalhostInputRef = ref, className: "form-input", defaultChecked: serverSettings.framework.bypassNgrokLocalhost, disabled: this.state ? !this.state.ngrokPath : !serverSettings.framework.ngrokPath }),
                                "Bypass ngrok for local addresses")))),
                React.createElement("div", { className: "dialog-buttons" },
                    React.createElement("button", { className: "appsettings-savebtn", onClick: () => this.onAccept() }, "Save"),
                    "\u00A0\u00A0\u00A0",
                    React.createElement("button", { className: "appsettings-cancelbtn", onClick: () => this.onClose() }, "Cancel")))));
    }
}
exports.AppSettingsDialog = AppSettingsDialog;
//# sourceMappingURL=appSettingsDialog.js.map