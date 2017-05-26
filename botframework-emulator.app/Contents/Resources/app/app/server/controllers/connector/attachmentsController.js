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
const HttpStatus = require("http-status-codes");
const ResponseTypes = require("../../../types/responseTypes");
const responseTypes_1 = require("../../../types/responseTypes");
const utils_1 = require("../../../utils");
const log = require("../../log");
class AttachmentsController {
    static registerRoutes(server) {
        server.router.get('/v3/attachments/:attachmentId', this.getAttachmentInfo);
        server.router.get('/v3/attachments/:attachmentId/views/:viewId', this.getAttachment);
    }
    static uploadAttachment(attachmentData) {
        if (!attachmentData.type)
            throw ResponseTypes.createAPIException(HttpStatus.BAD_REQUEST, responseTypes_1.ErrorCodes.MissingProperty, "You must specify type property for the attachment");
        if (!attachmentData.originalBase64)
            throw ResponseTypes.createAPIException(HttpStatus.BAD_REQUEST, responseTypes_1.ErrorCodes.MissingProperty, "You must specify originalBase64 byte[] for the attachment");
        let attachment = attachmentData;
        attachment.id = utils_1.uniqueId();
        AttachmentsController.attachments[attachment.id] = attachment;
        return attachment.id;
    }
}
AttachmentsController.attachments = {};
AttachmentsController.getAttachmentInfo = (req, res, next) => {
    try {
        const parms = req.params;
        let attachment = AttachmentsController.attachments[parms.attachmentId];
        if (attachment) {
            let attachmentInfo = {
                name: attachment.name,
                type: attachment.type,
                views: []
            };
            if (attachment.originalBase64)
                attachmentInfo.views.push({
                    viewId: 'original', size: new Buffer(attachment.originalBase64, 'base64').length
                });
            if (attachment.thumbnailBase64)
                attachmentInfo.views.push({
                    viewId: 'thumbnail', size: new Buffer(attachment.thumbnailBase64, 'base64').length
                });
            res.send(HttpStatus.OK, attachmentInfo);
            res.end();
            log.api('getAttachmentInfo', req, res, null, attachmentInfo);
        }
        else
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, `attachment[${parms.attachmentId}] not found`);
    }
    catch (err) {
        let error = ResponseTypes.sendErrorResponse(req, res, next, err);
        log.api('getAttachmentInfo', req, res, null, error);
    }
};
AttachmentsController.getAttachment = (req, res, next) => {
    try {
        const parms = req.params;
        let attachment = AttachmentsController.attachments[parms.attachmentId];
        if (attachment) {
            if (parms.viewId == "original") {
                if (attachment.originalBase64) {
                    res.contentType = attachment.type;
                    var buffer = new Buffer(attachment.originalBase64, 'base64');
                    res.send(HttpStatus.OK, buffer);
                    log.api('getAttachment', req, res, null, buffer.length);
                }
                else {
                    throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "There is no original view");
                }
            }
            else if (parms.viewId == "thumbnail") {
                if (attachment.thumbnailBase64) {
                    res.contentType = attachment.type;
                    var buffer = new Buffer(attachment.thumbnailBase64, 'base64');
                    res.send(HttpStatus.OK, buffer);
                    log.api('getAttachment', req, res, null, buffer.length);
                }
                else {
                    throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "There is no thumbnail view");
                }
            }
        }
        else {
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, `attachment[${parms.attachmentId}] not found`);
        }
    }
    catch (err) {
        let error = ResponseTypes.sendErrorResponse(req, res, next, err);
        log.api('getAttachment', req, res, null, error);
    }
};
exports.AttachmentsController = AttachmentsController;
//# sourceMappingURL=attachmentsController.js.map