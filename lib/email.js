"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConfirmationEmail = sendConfirmationEmail;
exports.sendLeadNotificationEmail = sendLeadNotificationEmail;
exports.sendEmail = sendEmail;
var resend_1 = require("resend");
var sendEmail_1 = require("./sendEmail");
var resend = new resend_1.Resend(process.env.RESEND_API_KEY);
function getProductTitle(productType) {
    switch (productType) {
        case 'life':
            return 'Life Insurance';
        case 'disability':
            return 'Disability Insurance';
        case 'supplemental':
            return 'Supplemental Health Insurance';
        case 'auto':
            return 'Auto Insurance';
        case 'homeowners':
            return 'Homeowners Insurance';
        default:
            return 'Insurance';
    }
}
function getProductSpecificFields(data) {
    switch (data.product_type) {
        case 'life':
            return "\n        ".concat(data.coverage_amount ? "<p><strong>Coverage Amount:</strong> $".concat(data.coverage_amount.toLocaleString(), "</p>") : '', "\n        ").concat(data.term_length ? "<p><strong>Term Length:</strong> ".concat(data.term_length, " years</p>") : '', "\n        ").concat(data.tobacco_use !== undefined ? "<p><strong>Tobacco Use:</strong> ".concat(data.tobacco_use ? 'Yes' : 'No', "</p>") : '', "\n      ");
        case 'disability':
            return "\n        ".concat(data.occupation ? "<p><strong>Occupation:</strong> ".concat(data.occupation, "</p>") : '', "\n        ").concat(data.employment_status ? "<p><strong>Employment Status:</strong> ".concat(data.employment_status, "</p>") : '', "\n        ").concat(data.income_range ? "<p><strong>Income Range:</strong> ".concat(data.income_range, "</p>") : '', "\n      ");
        case 'supplemental':
            return "\n        ".concat(data.pre_existing_conditions ? "<p><strong>Pre-existing Conditions:</strong> ".concat(data.pre_existing_conditions, "</p>") : '', "\n        ").concat(data.desired_coverage_type ? "<p><strong>Desired Coverage Type:</strong> ".concat(data.desired_coverage_type, "</p>") : '', "\n      ");
        default:
            return '';
    }
}
function sendConfirmationEmail(data) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('Sending confirmation email');
                    return [4 /*yield*/, (0, sendEmail_1.sendConsumerConfirmationEmail)(data.email, data)];
                case 1:
                    _a.sent();
                    console.log('Confirmation email sent successfully');
                    return [2 /*return*/, { success: true }];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error sending confirmation email:', error_1);
                    return [2 /*return*/, { success: false, error: error_1 }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function sendLeadNotificationEmail(data) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('Sending lead notification email');
                    return [4 /*yield*/, (0, sendEmail_1.sendAgentNotificationEmail)(data)];
                case 1:
                    _a.sent();
                    console.log('Lead notification email sent successfully');
                    return [2 /*return*/, { success: true }];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error sending lead notification email:', error_2);
                    return [2 /*return*/, { success: false, error: error_2 }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function sendEmail(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, data, error, error_3;
        var to = _b.to, subject = _b.subject, text = _b.text, html = _b.html;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, resend.emails.send({
                            from: 'QuoteLinker <support@quotelinker.com>',
                            to: to,
                            subject: subject,
                            text: text,
                            html: html || text,
                        })];
                case 1:
                    _c = _d.sent(), data = _c.data, error = _c.error;
                    if (error) {
                        console.error('Failed to send email:', error);
                        throw error;
                    }
                    return [2 /*return*/, data];
                case 2:
                    error_3 = _d.sent();
                    console.error('Email service error:', error_3);
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
