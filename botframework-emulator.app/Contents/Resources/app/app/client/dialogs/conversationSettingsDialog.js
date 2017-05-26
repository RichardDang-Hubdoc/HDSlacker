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
const settings_1 = require("../settings");
const reducers_1 = require("../reducers");
const utils_1 = require("../../utils");
class ConversationSettingsDialog extends React.Component {
    constructor() {
        super(...arguments);
        this.pageClicked = (ev) => {
            if (ev.defaultPrevented)
                return;
            let target = ev.srcElement;
            while (target) {
                if (target.className === "conversationsettings-dialog") {
                    ev.preventDefault();
                    return;
                }
                target = target.parentElement;
            }
            // Click was outside the dialog. Close.
            this.onClose();
        };
        this.onSaveUserChanges = (users, currentUser) => {
            reducers_1.AddressBarActions.hideConversationSettings();
        };
        this.onClose = () => {
            reducers_1.AddressBarActions.hideConversationSettings();
        };
    }
    componentWillMount() {
        window.addEventListener('click', this.pageClicked);
        this.settingsUnsubscribe = settings_1.addSettingsListener((settings) => {
            if (settings.addressBar.showConversationSettings != this.showing) {
                this.showing = settings.addressBar.showConversationSettings;
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
        if (!settings.addressBar.showConversationSettings)
            return null;
        const serverSettings = settings.serverSettings;
        let users;
        return (React.createElement("div", null,
            React.createElement("div", { className: "dialog-background" }),
            React.createElement("div", { className: "emu-dialog conversationsettings-dialog" },
                React.createElement(CloseButton, { className: 'conversationsettings-closex', onClick: () => this.onClose() }),
                React.createElement(UserList, { className: 'conversationsettings-userlist', users: [], currentUser: { id: utils_1.uniqueId(), name: 'User 1' }, onSave: (users, currentUser) => this.onSaveUserChanges(users, currentUser), onCancel: () => this.onClose() }))));
    }
}
exports.ConversationSettingsDialog = ConversationSettingsDialog;
class CloseButton extends React.Component {
    render() {
        return React.createElement("a", { className: this.props.className, href: "javascript:void(0)", onClick: () => this.props.onClick() }, "[x]");
    }
}
class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: this.props.users,
            currentUser: this.props.currentUser
        };
    }
    render() {
        return (React.createElement("div", { className: this.props.className },
            React.createElement("h1", null, "Manage Users"),
            React.createElement("div", { className: 'conversationsettings-userlist-area' }),
            React.createElement("div", null,
                React.createElement("button", { className: 'save-button', onClick: () => this.props.onSave(this.state.users, this.state.currentUser) }, "Save"),
                React.createElement("button", { className: 'cancel-button', onClick: () => this.props.onCancel() }, "Cancel"))));
    }
}
//# sourceMappingURL=conversationSettingsDialog.js.map