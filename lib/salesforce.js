"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.SalesforceClient = void 0;
exports.isSalesforceConfigured = isSalesforceConfigured;
exports.createSalesforceOpportunity = createSalesforceOpportunity;
var email_1 = require("./email");
var jsforce_1 = require("jsforce");
var SALESFORCE_INSTANCE_URL = process.env.SALESFORCE_INSTANCE_URL;
var SALESFORCE_TOKEN = process.env.SALESFORCE_TOKEN;
// Function to check if Salesforce is properly configured
function isSalesforceConfigured() {
    return !!(process.env.SALESFORCE_TOKEN &&
        process.env.SALESFORCE_INSTANCE_URL);
}
// Map insurance types to Salesforce product types
var INSURANCE_TYPE_MAP = {
    term_life: 'Term Life Insurance',
    permanent_life: 'Permanent Life Insurance',
    supplemental_health: 'Supplemental Health Insurance',
    short_term_disability: 'Short-Term Disability Insurance'
};
// Map form fields to Salesforce opportunity fields
function mapFieldsToSalesforce(submission) {
    var baseFields = {
        Name: "Insurance Quote - ".concat(INSURANCE_TYPE_MAP[submission.insuranceType]),
        StageName: 'New',
        CloseDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        LeadSource: submission.utm_source || 'Web',
        Description: JSON.stringify(submission),
    };
    // Common fields for all insurance types
    var commonFields = {
        FirstName__c: submission.firstName,
        LastName__c: submission.lastName,
        Email__c: submission.email,
        Phone__c: submission.phone,
        ZipCode__c: submission.zipCode,
        Age__c: submission.age,
        HouseholdSize__c: submission.householdSize,
        IncomeRange__c: submission.incomeRange,
        BestTimeToCall__c: submission.bestTimeToCall,
        UTM_Source__c: submission.utm_source,
        UTM_Medium__c: submission.utm_medium,
        UTM_Campaign__c: submission.utm_campaign,
        UTM_Content__c: submission.utm_content,
        UTM_Term__c: submission.utm_term,
        SubmissionTimestamp__c: submission.timestamp,
    };
    // Insurance type specific fields
    var insuranceSpecificFields = {
        term_life: {
            CoverageAmount__c: submission.coverageAmount,
            TermLength__c: submission.termLength,
            TobaccoUse__c: submission.tobaccoUse,
        },
        permanent_life: {
            CoverageAmount__c: submission.coverageAmount,
            PolicyType__c: submission.policyType,
            TobaccoUse__c: submission.tobaccoUse,
        },
        supplemental_health: {
            HealthStatus__c: submission.healthStatus,
            PreExistingConditions__c: submission.preExistingConditions,
            DesiredCoverageType__c: submission.desiredCoverageType,
        },
        short_term_disability: {
            Occupation__c: submission.occupation,
            EmploymentStatus__c: submission.employmentStatus,
            IncomeRange__c: submission.incomeRange,
            PreExistingConditions__c: submission.preExistingConditions,
        },
    };
    return __assign(__assign(__assign({}, baseFields), commonFields), (insuranceSpecificFields[submission.insuranceType] || {}));
}
function createSalesforceOpportunity(submission) {
    return __awaiter(this, void 0, void 0, function () {
        var opportunityData, response, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isSalesforceConfigured()) {
                        console.warn('Salesforce is not configured - skipping opportunity creation');
                        return [2 /*return*/, { success: false, error: 'Salesforce integration not configured' }];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 8]);
                    opportunityData = mapFieldsToSalesforce(submission);
                    return [4 /*yield*/, fetch("".concat(SALESFORCE_INSTANCE_URL, "/services/data/v57.0/sobjects/Opportunity"), {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(SALESFORCE_TOKEN),
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(opportunityData)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to create Salesforce opportunity');
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    if (!(result && result.id)) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetch("".concat(SALESFORCE_INSTANCE_URL, "/services/data/v57.0/sobjects/Task"), {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(SALESFORCE_TOKEN),
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                WhoId: result.id,
                                Subject: "New ".concat(INSURANCE_TYPE_MAP[submission.insuranceType], " Quote Request"),
                                Description: "New quote request from ".concat(submission.firstName, " ").concat(submission.lastName, ".\nPhone: ").concat(submission.phone, "\nEmail: ").concat(submission.email, "\nBest Time to Call: ").concat(submission.bestTimeToCall),
                                Priority: 'High',
                                Status: 'New',
                                Type: 'Quote Request'
                            })
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, { success: true, data: result }];
                case 6:
                    error_1 = _a.sent();
                    console.error('Salesforce integration error:', error_1);
                    // Send fallback notification
                    return [4 /*yield*/, (0, email_1.sendEmail)({
                            to: process.env.AGENT_EMAIL,
                            subject: 'New Quote Request - Salesforce Integration Failed',
                            text: "A new quote request was received but failed to sync with Salesforce. Please check the system.\n\nForm Data: ".concat(JSON.stringify(submission, null, 2))
                        })];
                case 7:
                    // Send fallback notification
                    _a.sent();
                    return [2 /*return*/, {
                            success: false,
                            error: error_1 instanceof Error ? error_1.message : 'Unknown error'
                        }];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function getSalesforceToken() {
    return __awaiter(this, void 0, void 0, function () {
        var token;
        return __generator(this, function (_a) {
            token = process.env.SALESFORCE_TOKEN;
            if (!token) {
                console.warn('SALESFORCE_TOKEN is not defined');
                return [2 /*return*/, null];
            }
            return [2 /*return*/, token];
        });
    });
}
var SalesforceClient = /** @class */ (function () {
    function SalesforceClient(config) {
        this.config = config;
        this.connection = new jsforce_1.default.Connection({
            loginUrl: config.loginUrl
        });
    }
    SalesforceClient.prototype.authenticate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.login(this.config.username, this.config.password + this.config.securityToken)];
                    case 1:
                        userInfo = _a.sent();
                        return [2 /*return*/, userInfo];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Salesforce authentication failed:', error_2);
                        throw new Error('Failed to authenticate with Salesforce');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SalesforceClient.prototype.createOpportunity = function (opportunity) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.sobject('Opportunity').create(opportunity)];
                    case 1:
                        result = _b.sent();
                        if (!result.success) {
                            throw new Error("Failed to create opportunity: ".concat((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message));
                        }
                        return [2 /*return*/, result];
                    case 2:
                        error_3 = _b.sent();
                        console.error('Failed to create opportunity:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SalesforceClient.prototype.deleteOpportunity = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.sobject('Opportunity').destroy(id)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Failed to delete opportunity:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SalesforceClient.prototype.getOpportunity = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.sobject('Opportunity').retrieve(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Failed to retrieve opportunity:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SalesforceClient.prototype.updateOpportunity = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.sobject('Opportunity').update(__assign({ Id: id }, data))];
                    case 1:
                        result = _b.sent();
                        if (!result.success) {
                            throw new Error("Failed to update opportunity: ".concat((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message));
                        }
                        return [2 /*return*/, result];
                    case 2:
                        error_6 = _b.sent();
                        console.error('Failed to update opportunity:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SalesforceClient;
}());
exports.SalesforceClient = SalesforceClient;
