"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const React = require("react");
class PaymentDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = { detailsAreVisible: false };
        this.toggleDetails = this.toggleDetails.bind(this);
    }
    toggleDetails(evt) {
        this.updateState({ detailsAreVisible: !this.state.detailsAreVisible });
    }
    updateState(update) {
        this.setState(Object.assign({}, this.state, update));
    }
    render() {
        let details = undefined;
        if (this.state.detailsAreVisible) {
            let items = [];
            let idx = 0;
            this.props.details.displayItems.forEach(item => {
                items.push(React.createElement("div", { className: 'line-item', key: idx },
                    React.createElement("div", { className: 'item-label' }, item.label),
                    React.createElement("div", { className: 'item-value' },
                        item.pending ? '*' : '',
                        "$",
                        item.amount.value)));
                idx++;
            });
            details = (React.createElement("div", { className: 'line-items' }, items));
        }
        return (React.createElement("div", { className: 'total-container fixed-right' },
            details,
            React.createElement("div", { className: 'total-line' },
                React.createElement("div", { className: 'total-label-container' },
                    React.createElement("div", { className: 'total-label' },
                        "Total (",
                        this.props.details.total.amount.currency,
                        ")"),
                    React.createElement("div", { className: 'show-details', onClick: this.toggleDetails }, (this.state.detailsAreVisible ? 'Hide' : 'Show') + ' details')),
                React.createElement("div", { className: 'total-value' },
                    this.props.details.total.pending ? '*' : '',
                    "$",
                    this.props.details.total.amount.value)),
            React.createElement("div", { className: 'total-line not-final' }, "* - Indicates the cost isn't final")));
    }
}
exports.PaymentDetails = PaymentDetails;
//# sourceMappingURL=paymentDetails.js.map