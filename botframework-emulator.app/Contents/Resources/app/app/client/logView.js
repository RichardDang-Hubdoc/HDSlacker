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
const rxjs_1 = require("rxjs");
const settings_1 = require("./settings");
const reducers_1 = require("./reducers");
const Constants = require("./constants");
const utils_1 = require("../utils");
const { remote } = require('electron');
const { Menu, MenuItem } = remote;
var Severity;
(function (Severity) {
    Severity[Severity["log"] = 0] = "log";
    Severity[Severity["info"] = 1] = "info";
    Severity[Severity["trace"] = 2] = "trace";
    Severity[Severity["debug"] = 3] = "debug";
    Severity[Severity["warn"] = 4] = "warn";
    Severity[Severity["error"] = 5] = "error";
})(Severity = exports.Severity || (exports.Severity = {}));
const number2 = (n) => {
    return ('0' + n).slice(-2);
};
const timestamp = (entry) => {
    const hours = number2(entry.timestamp.getHours());
    const minutes = number2(entry.timestamp.getMinutes());
    const seconds = number2(entry.timestamp.getSeconds());
    return React.createElement("span", { className: 'wc-logview-timestamp' },
        `[${hours}:${minutes}:${seconds}]`,
        "\u00A0");
};
const emit = (val, className) => {
    if (!val)
        return null;
    if (val.hasOwnProperty('messageType') && val['messageType'] === 'link') {
        //return <div className={className}><a className={className} title={val.title} href={val.link}>{val.text}</a>&nbsp;</div>
        return React.createElement("span", { className: className },
            React.createElement("a", { title: val.title, href: val.link }, val.text),
            "\u00A0");
    }
    else {
        let str = utils_1.safeStringify(val);
        return str.match(/\S+/g).map((s, i) => React.createElement("span", { className: className },
            s,
            "\u00A0"));
    }
};
const message = (entry, className) => {
    return emit(entry.message, className);
};
const args = (entry, className) => {
    if (entry.args && entry.args.length) {
        return entry.args
            .filter(arg => !!arg)
            .map((arg, i) => emit(arg, className));
    }
    return null;
};
const format = (entry, index, items, wrapStyle) => {
    const className = 'wc-logview-' + Severity[entry.severity];
    return (React.createElement("div", { key: index, className: 'emu-log-entry', style: wrapStyle },
        timestamp(entry),
        message(entry, className),
        args(entry, className)));
};
class LogView extends React.Component {
    constructor() {
        super();
        this.state = { entries: [] };
    }
    componentWillMount() {
        this.settingsUnsubscribe = settings_1.addSettingsListener(() => this.forceUpdate());
    }
    componentDidMount() {
        this.autoscrollSubscription = rxjs_1.Observable
            .fromEvent(this.scrollMe, 'scroll')
            .map(e => e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight)
            .distinctUntilChanged()
            .subscribe(autoscroll => reducers_1.LogActions.setAutoscroll(autoscroll));
        this.logSubscription = LogView.log$.subscribe(entry => {
            // Yep we have to set this.state here because otherwise we lose entries due to batching.
            if (entry) {
                this.state = { entries: [...this.state.entries, entry] };
            }
            else {
                this.state = { entries: [] };
            }
            this.setState(this.state);
        });
    }
    componentWillUnmount() {
        this.autoscrollSubscription.unsubscribe();
        this.logSubscription.unsubscribe();
        this.settingsUnsubscribe();
    }
    componentDidUpdate(prevProps, prevState) {
        if (settings_1.getSettings().log.autoscroll)
            this.scrollMe.scrollTop = this.scrollMe.scrollHeight;
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { className: "emu-panel-header" },
                React.createElement("span", { className: "logview-header-text" }, "Log"),
                React.createElement("a", { className: 'undecorated-text', href: 'javascript:void(0)', title: 'Log Menu' },
                    React.createElement("div", { className: 'logview-clear-output-button', dangerouslySetInnerHTML: { __html: Constants.hamburgerIcon('toolbar-button-dark', 24) }, onClick: () => this.showMenu() }))),
            React.createElement("div", { className: "wc-logview", ref: ref => this.scrollMe = ref }, this.state.entries.map((entry, i, items) => format(entry, i, items, { whiteSpace: (!settings_1.getSettings().wordwrap.wordwrap ? 'nowrap' : 'normal') })))));
    }
    showMenu() {
        const template = [
            {
                label: 'Clear log',
                click: () => reducers_1.LogActions.clear()
            },
            {
                type: 'checkbox',
                label: 'Word wrap',
                click: () => reducers_1.WordWrapAction.setWordWrap(!settings_1.getSettings().wordwrap.wordwrap),
                checked: settings_1.getSettings().wordwrap.wordwrap
            }
        ];
        const menu = Menu.buildFromTemplate(template);
        menu.popup();
    }
    static add(severity, message, ...args) {
        let entry = {
            severity,
            timestamp: new Date(),
            message,
            args
        };
        this.log$.next(entry);
        console[Severity[severity]](message, ...args);
    }
    static clear() {
        this.log$.next(null);
    }
}
LogView.log$ = new rxjs_1.Subject();
exports.LogView = LogView;
//# sourceMappingURL=logView.js.map