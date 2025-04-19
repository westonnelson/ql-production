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
var dotenv_1 = require("dotenv");
var salesforce_1 = require("../lib/salesforce");
// Load environment variables from .env.local
(0, dotenv_1.config)({ path: '.env.local' });
function testSalesforceIntegration() {
    return __awaiter(this, void 0, void 0, function () {
        var sfClient, userInfo, testOpportunity, createResult, retrievedOpportunity, updateResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting Salesforce integration test...');
                    sfClient = new salesforce_1.SalesforceClient({
                        username: process.env.SF_USERNAME || '',
                        password: process.env.SF_PASSWORD || '',
                        securityToken: process.env.SF_SECURITY_TOKEN || '',
                        loginUrl: process.env.SF_LOGIN_URL || 'https://login.salesforce.com'
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    // Test authentication
                    console.log('Authenticating with Salesforce...');
                    return [4 /*yield*/, sfClient.authenticate()];
                case 2:
                    userInfo = _a.sent();
                    console.log('Successfully authenticated as:', userInfo.username);
                    // Create test opportunity
                    console.log('Creating test opportunity...');
                    testOpportunity = {
                        Name: "Test Opportunity ".concat(new Date().toISOString()),
                        StageName: 'Prospecting',
                        CloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        Amount: 1000,
                        Description: 'Test opportunity created by integration test'
                    };
                    return [4 /*yield*/, sfClient.createOpportunity(testOpportunity)];
                case 3:
                    createResult = _a.sent();
                    console.log('Successfully created test opportunity with ID:', createResult.id);
                    // Retrieve the created opportunity
                    console.log('Retrieving created opportunity...');
                    return [4 /*yield*/, sfClient.getOpportunity(createResult.id)];
                case 4:
                    retrievedOpportunity = _a.sent();
                    console.log('Successfully retrieved opportunity:', retrievedOpportunity.Name);
                    // Update the opportunity
                    console.log('Updating opportunity...');
                    return [4 /*yield*/, sfClient.updateOpportunity(createResult.id, {
                            Amount: 2000,
                            Description: 'Updated test opportunity'
                        })];
                case 5:
                    updateResult = _a.sent();
                    console.log('Successfully updated opportunity');
                    // Clean up - delete the test opportunity
                    console.log('Cleaning up - deleting test opportunity...');
                    return [4 /*yield*/, sfClient.deleteOpportunity(createResult.id)];
                case 6:
                    _a.sent();
                    console.log('Successfully deleted test opportunity');
                    console.log('Salesforce integration test completed successfully!');
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error('Salesforce integration test failed:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Run the test
testSalesforceIntegration();
