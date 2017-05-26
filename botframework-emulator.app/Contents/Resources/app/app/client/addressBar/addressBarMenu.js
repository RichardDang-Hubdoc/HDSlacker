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
const emulator_1 = require("../emulator");
const Constants = require("../constants");
const electron_1 = require("electron");
const { Menu, MenuItem } = electron_1.remote;
class AddressBarMenu extends React.Component {
    showMenu() {
        const settings = settings_1.getSettings();
        const inConversation = ((settings.serverSettings.activeBot || '').length > 0 && (settings.conversation.conversationId || '').length > 0);
        const haveActiveBot = (settings.serverSettings.activeBot || '').length > 0;
        const template = [
            {
                label: 'New Conversation',
                click: () => reducers_1.ConversationActions.newConversation(),
                enabled: haveActiveBot
            },
            /*
            {
                label: 'Load Conversation',
                type: 'submenu',
                enabled: settings.serverSettings.activeBot.length > 0,
                submenu: [
                    {
                        label: 'TODO: Populate'
                    }
                ]
            },
            */
            {
                label: 'Conversation',
                type: 'submenu',
                enabled: inConversation,
                submenu: [
                    {
                        label: 'Send System Activity',
                        type: 'submenu',
                        enabled: true,
                        submenu: [
                            {
                                label: 'conversationUpdate (user added)',
                                click: () => {
                                    emulator_1.Emulator.addUser();
                                }
                            },
                            {
                                label: 'conversationUpdate (user removed)',
                                click: () => {
                                    emulator_1.Emulator.removeRandomUser();
                                }
                            },
                            {
                                label: 'contactRelationUpdate (bot added)',
                                click: () => {
                                    emulator_1.Emulator.botContactAdded();
                                }
                            },
                            {
                                label: 'contactRelationUpdate (bot removed)',
                                click: () => {
                                    emulator_1.Emulator.botContactRemoved();
                                }
                            },
                            {
                                label: 'typing',
                                click: () => {
                                    emulator_1.Emulator.typing();
                                }
                            },
                            {
                                label: 'ping',
                                click: () => {
                                    emulator_1.Emulator.ping();
                                }
                            },
                            {
                                label: 'deleteUserData',
                                click: () => {
                                    emulator_1.Emulator.deleteUserData();
                                }
                            }
                        ]
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'End Conversation',
                        click: () => {
                            reducers_1.ConversationActions.endConversation();
                        }
                    }
                ]
            },
            /*
            {
                label: 'Manage Users...',
                click: () => AddressBarActions.showConversationSettings()
            },
            */
            {
                type: 'separator'
            },
            {
                label: 'App Settings',
                click: () => reducers_1.AddressBarActions.showAppSettings()
            },
            {
                type: 'separator'
            },
            /*
            {
                label: 'Help',
                //click: () => AddressBarActions.showHelp()
            },
            */
            {
                label: 'About',
                click: () => reducers_1.AddressBarActions.showAbout()
            },
            {
                type: 'separator'
            },
            {
                label: 'Legal',
                click: () => window.open('https://g.microsoftonline.com/0BX20en/721')
            },
            {
                label: 'Privacy',
                click: () => window.open('https://go.microsoft.com/fwlink/?LinkId=512132')
            },
            {
                label: 'Credits',
                click: () => window.open('https://aka.ms/l7si1g')
            },
            {
                type: 'separator'
            },
            {
                label: 'Report issues',
                click: () => window.open('https://aka.ms/cy106f')
            },
        ];
        const menu = Menu.buildFromTemplate(template);
        menu.popup();
    }
    render() {
        return (React.createElement("a", { className: 'undecorated-text', href: 'javascript:void(0)', title: 'Settings' },
            React.createElement("div", { className: "addressbar-menu", dangerouslySetInnerHTML: { __html: Constants.hamburgerIcon('toolbar-button', 24) }, onClick: () => this.showMenu() })));
    }
}
exports.AddressBarMenu = AddressBarMenu;
//# sourceMappingURL=addressBarMenu.js.map