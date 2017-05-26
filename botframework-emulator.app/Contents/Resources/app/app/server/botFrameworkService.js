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
const botFrameworkAuthentication_1 = require("./botFrameworkAuthentication");
const conversationsController_1 = require("./controllers/connector/conversationsController");
const attachmentsController_1 = require("./controllers/connector/attachmentsController");
const botStateController_1 = require("./controllers/connector/botStateController");
const conversationsControllerV3_1 = require("./controllers/directLine/conversationsControllerV3");
const emulatorController_1 = require("./controllers/emulator/emulatorController");
const restServer_1 = require("./restServer");
const settings_1 = require("./settings");
const log = require("./log");
const ngrok = require("./ngrok");
const emulator_1 = require("./emulator");
const utils = require("../utils");
/**
 * Communicates with the bot.
 */
class BotFrameworkService extends restServer_1.RestServer {
    constructor() {
        super("Emulator");
        this.authentication = new botFrameworkAuthentication_1.BotFrameworkAuthentication();
        conversationsController_1.ConversationsController.registerRoutes(this, this.authentication);
        attachmentsController_1.AttachmentsController.registerRoutes(this);
        botStateController_1.BotStateController.registerRoutes(this, this.authentication);
        conversationsControllerV3_1.ConversationsControllerV3.registerRoutes(this);
        emulatorController_1.EmulatorController.registerRoutes(this);
        settings_1.addSettingsListener((settings) => {
            this.configure(settings);
        });
        this.router.on('listening', () => {
            this.configure(settings_1.getSettings());
            emulator_1.Emulator.send('listening', { serviceUrl: this.localhostServiceUrl });
        });
        //this.router.on('NotFound', (req: Restify.Request, res: Restify.Response, cb) => {});
    }
    getServiceUrl(botUrl) {
        if (this.bypassNgrokLocalhost && utils.isLocalhostUrl(botUrl))
            return this.localhostServiceUrl;
        else {
            return ngrok.running()
                ? this.ngrokServiceUrl || this.localhostServiceUrl
                : this.localhostServiceUrl;
        }
    }
    startup() {
        this.restart();
    }
    relaunchNgrok(settings) {
        let router = this.router;
        if (!router)
            return;
        let address = router.address();
        if (!address)
            return;
        let port = address.port;
        if (!port)
            return;
        const prevNgrokPath = this.ngrokPath;
        this.ngrokPath = settings.framework.ngrokPath;
        const prevbypassNgrokLocalhost = this.bypassNgrokLocalhost;
        this.bypassNgrokLocalhost = settings.framework.bypassNgrokLocalhost;
        this.localhostServiceUrl = `http://127.0.0.1:${port}`;
        const startNgrok = () => {
            this.inspectUrl = null;
            this.ngrokServiceUrl = null;
            // if we have an ngrok path
            if (this.ngrokPath) {
                // then make it so
                ngrok.connect({
                    port,
                    path: this.ngrokPath
                }, (err, url, inspectPort) => {
                    if (err) {
                        log.error(`Failed to start ngrok: ${err.message || err.msg}`);
                        if (err.code && err.code === 'ENOENT') {
                            log.debug("The path to ngrok may be incorrect.");
                            log.error(log.ngrokConfigurationLink('Edit ngrok settings'));
                        }
                        else {
                            log.debug("ngrok may already be running in a different process. ngrok's free tier allows only one instance at a time per host.");
                        }
                    }
                    else {
                        this.inspectUrl = `http://127.0.0.1:${inspectPort}`;
                        this.ngrokServiceUrl = url;
                        log.debug(`ngrok listening on ${url}`);
                        log.debug('ngrok traffic inspector:', log.makeLinkMessage(this.inspectUrl, this.inspectUrl));
                        if (this.bypassNgrokLocalhost) {
                            log.debug(`Will bypass ngrok for local addresses`);
                        }
                        else {
                            log.debug(`Will use ngrok for local addresses`);
                        }
                    }
                    // Sync settings to client
                    settings_1.getStore().dispatch({
                        type: 'Framework_Set',
                        state: {
                            ngrokPath: this.ngrokPath,
                            bypassNgrokLocalhost: this.bypassNgrokLocalhost
                        }
                    });
                });
            }
            else {
                log.debug("ngrok not configured (only needed when connecting to remotely hosted bots)");
                log.error(log.makeLinkMessage('Connecting to bots hosted remotely', 'https://aka.ms/cnjvpo'));
                log.error(log.ngrokConfigurationLink('Edit ngrok settings'));
            }
        };
        if (this.ngrokPath !== prevNgrokPath) {
            ngrok.kill((wasRunning) => {
                if (wasRunning)
                    log.debug('ngrok stopped');
                startNgrok();
                return true;
            });
        }
        else if (this.ngrokServiceUrl && this.bypassNgrokLocalhost !== prevbypassNgrokLocalhost) {
            if (this.bypassNgrokLocalhost) {
                log.debug(`Will bypass ngrok for local addresses`);
            }
            else {
                log.debug(`Will use ngrok for local addresses`);
            }
        }
    }
    /**
     * Applies configuration changes.
     */
    configure(settings) {
        // Did ngrok path change?
        if (this.ngrokPath !== settings.framework.ngrokPath ||
            this.bypassNgrokLocalhost !== settings.framework.bypassNgrokLocalhost) {
            this.relaunchNgrok(settings);
        }
    }
}
exports.BotFrameworkService = BotFrameworkService;
//# sourceMappingURL=botFrameworkService.js.map