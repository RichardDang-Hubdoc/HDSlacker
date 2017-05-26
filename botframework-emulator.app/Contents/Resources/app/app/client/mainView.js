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
const Splitter = require("react-split-pane");
const BotChat = require("botframework-webchat-speech");
const log = require("./log");
const settings_1 = require("./settings");
const reducers_1 = require("./reducers");
const serverSettingsTypes_1 = require("../types/serverSettingsTypes");
const addressBar_1 = require("./addressBar/addressBar");
const inspectorView_1 = require("./inspectorView");
const logView_1 = require("./logView");
const aboutDialog_1 = require("./dialogs/aboutDialog");
const appSettingsDialog_1 = require("./dialogs/appSettingsDialog");
const conversationSettingsDialog_1 = require("./dialogs/conversationSettingsDialog");
const Constants = require("./constants");
const emulator_1 = require("./emulator");
const botEmulatorContext_1 = require("./botEmulatorContext");
const addressBarOperators_1 = require("./addressBar/addressBarOperators");
const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
class MainView extends React.Component {
    constructor() {
        super(...arguments);
        this.reuseKey = 0;
        this.shouldWarnOfBotChange = false;
    }
    componentWillMount() {
        this.settingsUnsubscribe = settings_1.addSettingsListener((settings) => {
            try {
                let conversationChanged = false;
                if (this.conversationId !== settings.conversation.conversationId) {
                    this.conversationId = settings.conversation.conversationId || '';
                    conversationChanged = true;
                }
                let userChanged = false;
                let currentUserId = settings.serverSettings.users ? settings.serverSettings.users.currentUserId : 'default-user';
                if (this.userId !== currentUserId) {
                    this.userId = currentUserId || '';
                    userChanged = true;
                }
                let botChanged = false;
                if (this.botId !== settings.serverSettings.activeBot) {
                    this.botId = settings.serverSettings.activeBot || '';
                    botChanged = true;
                }
                if (conversationChanged || userChanged || botChanged) {
                    if (this.directline) {
                        this.directline.end();
                        this.directline = undefined;
                        //    log.debug(`ended conversation`);
                    }
                    if (this.conversationId.length && this.userId.length && this.botId.length) {
                        this.directline = new BotChat.DirectLine({
                            secret: settings.conversation.conversationId,
                            token: settings.conversation.conversationId,
                            domain: `${emulator_1.Emulator.serviceUrl}/v3/directline`,
                            webSocket: false
                        });
                        //    log.debug(`started new conversation`);
                    }
                    this.reuseKey++;
                    this.forceUpdate();
                }
            }
            catch (e) {
                //log.error(e.message);
            }
        });
    }
    componentWillUnmount() {
        if (this.settingsUnsubscribe) {
            this.settingsUnsubscribe();
            this.settingsUnsubscribe = undefined;
        }
        if (this.directline) {
            this.directline.end();
            this.directline = undefined;
        }
        this.conversationId = undefined;
        this.userId = undefined;
        this.botId = undefined;
    }
    componentDidMount() {
        // listen to future protocol handler invocations and update the emulator's active bot when this happens
        ipcRenderer.on('botemulator', (event, message) => {
            console.log('received url: ' + message);
            this.shouldWarnOfBotChange = true;
            this.setBot(message);
        });
        console.log("location.search: " + location.search);
        // on application start, a query string may have some parameters that provide initial context about
        // the bot to connect to
        if (location.search) {
            this.setBot(location.search);
        }
        // request any urls that may have queued while the app was starting
        ipcRenderer.send('getUrls');
    }
    // set the current bot based on an encoded bot emulator URI
    // based on the setting avialability, this will either immediately or in a deferred way set
    // the address information to the encoded bot and connect to this bot
    setBot(encodedBot) {
        let botContext = new botEmulatorContext_1.BotEmulatorContext(encodedBot);
        if (botContext.isValid()) {
            // settings may or may not be loaded at this point
            // if they are, use them directly, if not, wait for them to be loaded
            if (this.settingsAreLoaded()) {
                this.verifyAndAssignBot(botContext);
            }
            else {
                this.settingsLoadUnsubscribe = settings_1.addSettingsListener((settings) => {
                    if (botContext && this.settingsAreLoaded()) {
                        this.verifyAndAssignBot(botContext);
                        botContext = undefined;
                        if (this.settingsLoadUnsubscribe) {
                            this.settingsLoadUnsubscribe();
                            this.settingsLoadUnsubscribe = undefined;
                        }
                    }
                });
            }
        }
    }
    // determines if we need to warn the user that the bot connection will change due to an event
    // such as a protocol handler invocation, and in this case let the user choose whether to continue or not
    verifyAndAssignBot(botContext) {
        let assignBot = true;
        if (this.shouldWarnOfBotChange) {
            const serverSettings = new serverSettingsTypes_1.Settings(settings_1.getSettings().serverSettings);
            const activeBot = serverSettings.getActiveBot();
            if (activeBot && !botContext.matchesBot(activeBot)) {
                if (remote.dialog.showMessageBox({
                    type: 'question',
                    title: 'Connect to Bot',
                    message: 'Are you sure you want to update and connect to the bot at \'' + botContext.endpoint + '\'?',
                    buttons: ['Yes', 'No'],
                    defaultId: 0,
                    cancelId: 1
                }) === 1) {
                    assignBot = false;
                }
            }
            this.shouldWarnOfBotChange = false;
        }
        if (assignBot) {
            addressBarOperators_1.AddressBarOperators.assignBot(botContext);
        }
    }
    // Determine if the settings are currently loaded and available to use
    settingsAreLoaded() {
        const settings = settings_1.getSettings();
        return (settings && settings.serverSettings && settings.serverSettings.bots);
    }
    getCurrentUser(serverSettings) {
        if (serverSettings && serverSettings.users && serverSettings.users.currentUserId) {
            let user = serverSettings.users.usersById[serverSettings.users.currentUserId];
            if (user && user.id && user.id.length)
                return user;
        }
        return null;
    }
    verticalSplitChange(size) {
        this.updateBotChatContainerCSS(size);
        reducers_1.LayoutActions.rememberVerticalSplitter(size);
    }
    updateBotChatContainerCSS(size) {
        if (this.botChatContainer) {
            let bounds = remote.getCurrentWindow().getBounds();
            if (bounds.width - size <= 450) {
                this.botChatContainer.classList.remove('wc-wide');
                this.botChatContainer.classList.add('wc-narrow');
            }
            else if (bounds.width - size >= 768) {
                this.botChatContainer.classList.remove('wc-narrow');
                this.botChatContainer.classList.add('wc-wide');
            }
            else {
                this.botChatContainer.classList.remove('wc-wide', 'wc-narrow');
            }
        }
    }
    initBotChatContainerRef(ref, initialWidth) {
        this.botChatContainer = ref;
        this.updateBotChatContainerCSS(initialWidth);
    }
    botChatComponent(initialWidth) {
        if (this.directline) {
            const settings = settings_1.getSettings();
            const srvSettings = new serverSettingsTypes_1.Settings(settings.serverSettings);
            const activeBot = srvSettings.getActiveBot();
            const props = {
                botConnection: this.directline,
                locale: activeBot.locale || remote.app.getLocale(),
                formatOptions: {
                    showHeader: false
                },
                selectedActivity: settings_1.selectedActivity$(),
                user: this.getCurrentUser(settings.serverSettings),
                bot: { name: "Bot", id: activeBot.botId },
                resize: 'detect',
                speechOptions: {
                    speechRecognizer: new BotChat.SpeechRecognition.CognitiveServicesSpeechRecognizer({ fetchCallback: this.fetchSpeechToken.bind(this), fetchOnExpiryCallback: this.fetchSpeechTokenOnExpiry.bind(this) }),
                    speechSynthesizer: new BotChat.SpeechSynthesis.BrowserSpeechSynthesizer()
                }
            };
            reducers_1.InspectorActions.clear();
            return React.createElement("div", { className: "wc-app", ref: ref => this.initBotChatContainerRef(ref, initialWidth) },
                React.createElement(BotChat.Chat, Object.assign({ key: this.reuseKey }, props)));
        }
        else {
            return (React.createElement("div", { className: 'emu-chatview-background' },
                React.createElement("div", { className: 'box-centered', dangerouslySetInnerHTML: { __html: Constants.botFrameworkIconEmbossed('', 158) } })));
        }
    }
    fetchSpeechToken(authIdEvent) {
        return this.getSpeechToken(authIdEvent, false);
    }
    fetchSpeechTokenOnExpiry(authIdEvent) {
        return this.getSpeechToken(authIdEvent, true);
    }
    getSpeechToken(authIdEvent, refresh = false) {
        return new Promise((resolve, reject) => {
            let message = refresh ? 'refreshSpeechToken' : 'getSpeechToken';
            let speechToken = ipcRenderer.sendSync(message, this.conversationId);
            if (speechToken) {
                if (speechToken.access_Token) {
                    resolve(speechToken.access_Token);
                    return;
                }
                else {
                    log.warn('Could not retrieve Cognitive Services speech token');
                    log.warn('Error: ' + speechToken.error);
                    log.warn('Details: ' + speechToken.error_Description);
                }
            }
            else {
                log.error('Could not retrieve Cognitive Services speech token.');
            }
            resolve();
        });
    }
    render() {
        const settings = settings_1.getSettings();
        let vertSplit = settings.layout.vertSplit;
        if (typeof settings.layout.vertSplit === typeof Number) {
            vertSplit = `${settings.layout.vertSplit}px`;
        }
        let horizSplit = settings.layout.horizSplit;
        if (typeof settings.layout.horizSplit === typeof Number) {
            horizSplit = `${settings.layout.horizSplit}px`;
        }
        return (React.createElement("div", { className: 'mainview' },
            React.createElement("div", { className: 'botchat-container' },
                React.createElement(Splitter, { split: "vertical", minSize: "200px", defaultSize: vertSplit, primary: "second", onChange: (size) => this.verticalSplitChange(size) },
                    React.createElement("div", { className: 'fill-parent' },
                        React.createElement(addressBar_1.AddressBar, null),
                        this.botChatComponent(vertSplit)),
                    React.createElement("div", { className: "fill-parent" },
                        React.createElement(Splitter, { split: "horizontal", primary: "second", minSize: "42px", defaultSize: horizSplit, onChange: (size) => reducers_1.LayoutActions.rememberHorizontalSplitter(size) },
                            React.createElement("div", { className: "wc-chatview-panel" },
                                React.createElement(inspectorView_1.InspectorView, null)),
                            React.createElement("div", { className: "fill-parent" },
                                React.createElement(logView_1.LogView, null)))))),
            React.createElement(aboutDialog_1.AboutDialog, null),
            React.createElement(appSettingsDialog_1.AppSettingsDialog, null),
            React.createElement(conversationSettingsDialog_1.ConversationSettingsDialog, null)));
    }
}
exports.MainView = MainView;
//# sourceMappingURL=mainView.js.map