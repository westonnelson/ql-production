"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendClient = void 0;
exports.isResendConfigured = isResendConfigured;
var resend_1 = require("resend");
// Initialize Resend with a placeholder key if not available
var resendApiKey = process.env.RESEND_API_KEY || 'placeholder_key';
// Create the Resend client
exports.resendClient = new resend_1.Resend(resendApiKey);
// Export a function to check if Resend is properly configured
function isResendConfigured() {
    return !!process.env.RESEND_API_KEY;
}
