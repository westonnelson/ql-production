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
exports.sendConsumerConfirmationEmail = sendConsumerConfirmationEmail;
exports.sendAgentNotificationEmail = sendAgentNotificationEmail;
var resend_1 = require("./resend");
/**
 * Sends a confirmation email to the consumer who requested a quote.
 */
function sendConsumerConfirmationEmail(userEmail, data) {
    return __awaiter(this, void 0, void 0, function () {
        var productTitle, specificFields, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(0, resend_1.isResendConfigured)()) {
                        console.warn('Resend is not configured - skipping consumer confirmation email');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log("Preparing consumer confirmation email for ".concat(userEmail));
                    productTitle = getProductTitle(data.product_type);
                    specificFields = getProductSpecificFields(data);
                    console.log("Sending consumer confirmation email for ".concat(productTitle, " quote to ").concat(userEmail));
                    return [4 /*yield*/, resend_1.resendClient.emails.send({
                            from: 'QuoteLinker <support@quotelinker.com>',
                            to: userEmail,
                            subject: "Your ".concat(productTitle, " Quote Request Received"),
                            html: "\n        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">\n          <h1 style=\"color: #00a0b0;\">Thank You for Your Quote Request!</h1>\n          <p>Dear ".concat(data.first_name, ",</p>\n          <p>We've received your request for a ").concat(productTitle, " insurance quote. Our team will review your information and contact you shortly.</p>\n          <h2>Your Quote Details:</h2>\n          <ul>\n            <li>Insurance Type: ").concat(productTitle, "</li>\n            ").concat(specificFields, "\n          </ul>\n          <p>If you have any questions, please don't hesitate to contact us at support@quotelinker.com.</p>\n          <p>Best regards,<br>The QuoteLinker Team</p>\n        </div>\n      "),
                        })];
                case 2:
                    result = _a.sent();
                    console.log("Successfully sent consumer confirmation email to ".concat(userEmail), result);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to send consumer confirmation email to ".concat(userEmail, ":"), error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Sends a notification email to the agent when a new quote is submitted.
 * The agent notification is sent to newquote@quotelinker.com.
 */
function sendAgentNotificationEmail(data) {
    return __awaiter(this, void 0, void 0, function () {
        var productTitle, specificFields, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(0, resend_1.isResendConfigured)()) {
                        console.warn('Resend is not configured - skipping agent notification email');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log('Preparing agent notification email');
                    productTitle = getProductTitle(data.product_type);
                    specificFields = getProductSpecificFields(data);
                    console.log("Sending agent notification email for ".concat(productTitle, " quote from ").concat(data.first_name, " ").concat(data.last_name));
                    return [4 /*yield*/, resend_1.resendClient.emails.send({
                            from: 'QuoteLinker <support@quotelinker.com>',
                            to: 'newquote@quotelinker.com',
                            subject: "New ".concat(productTitle, " Quote Inquiry - ").concat(data.first_name, " ").concat(data.last_name),
                            html: "\n        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">\n          <h1 style=\"color: #00a0b0;\">New ".concat(productTitle, " Quote Request</h1>\n          <h2>Customer Information:</h2>\n          <ul>\n            <li>Name: ").concat(data.first_name, " ").concat(data.last_name, "</li>\n            <li>Email: ").concat(data.email, "</li>\n            <li>Phone: ").concat(data.phone, "</li>\n            <li>Age: ").concat(data.age, "</li>\n            <li>Gender: ").concat(data.gender, "</li>\n            ").concat(specificFields, "\n            ").concat(data.utm_source ? "<li>Source: ".concat(data.utm_source, "</li>") : '', "\n          </ul>\n          <p><a href=\"https://app.supabase.com/project/_/editor/table/leads\" style=\"display: inline-block; background-color: #00a0b0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;\">View in Supabase</a></p>\n        </div>\n      "),
                        })];
                case 2:
                    result = _a.sent();
                    console.log("Successfully sent agent notification email for ".concat(data.first_name, " ").concat(data.last_name), result);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Failed to send agent notification email:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
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
            return "\n        ".concat(data.coverage_amount ? "<li>Coverage Amount: $".concat(data.coverage_amount.toLocaleString(), "</li>") : '', "\n        ").concat(data.term_length ? "<li>Term Length: ".concat(data.term_length, " years</li>") : '', "\n        ").concat(data.tobacco_use !== undefined ? "<li>Tobacco Use: ".concat(data.tobacco_use ? 'Yes' : 'No', "</li>") : '', "\n      ");
        case 'disability':
            return "\n        ".concat(data.occupation ? "<li>Occupation: ".concat(data.occupation, "</li>") : '', "\n        ").concat(data.employment_status ? "<li>Employment Status: ".concat(data.employment_status, "</li>") : '', "\n        ").concat(data.income_range ? "<li>Income Range: ".concat(data.income_range, "</li>") : '', "\n      ");
        case 'supplemental':
            return "\n        ".concat(data.pre_existing_conditions ? "<li>Pre-existing Conditions: ".concat(data.pre_existing_conditions, "</li>") : '', "\n        ").concat(data.desired_coverage_type ? "<li>Desired Coverage Type: ".concat(data.desired_coverage_type, "</li>") : '', "\n      ");
        default:
            return '';
    }
}
