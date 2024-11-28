/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebCaptureModule = void 0;
const common_1 = __webpack_require__(3);
const web_capture_controller_1 = __webpack_require__(4);
const config_1 = __webpack_require__(6);
const captures_module_1 = __webpack_require__(7);
let WebCaptureModule = class WebCaptureModule {
};
exports.WebCaptureModule = WebCaptureModule;
exports.WebCaptureModule = WebCaptureModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            captures_module_1.CapturesModule,
        ],
        controllers: [web_capture_controller_1.WebCaptureController],
        providers: [],
    })
], WebCaptureModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebCaptureController = void 0;
const openapi = __webpack_require__(5);
const common_1 = __webpack_require__(3);
let WebCaptureController = class WebCaptureController {
    getHello() {
        return 'Hello World!';
    }
};
exports.WebCaptureController = WebCaptureController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebCaptureController.prototype, "getHello", null);
exports.WebCaptureController = WebCaptureController = __decorate([
    (0, common_1.Controller)()
], WebCaptureController);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CapturesModule = void 0;
const common_1 = __webpack_require__(3);
const captures_controller_1 = __webpack_require__(8);
const captures_repo_1 = __webpack_require__(9);
const drizzle_db_1 = __webpack_require__(10);
const captures_services_1 = __webpack_require__(19);
const sqs_module_1 = __webpack_require__(26);
let CapturesModule = class CapturesModule {
};
exports.CapturesModule = CapturesModule;
exports.CapturesModule = CapturesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            drizzle_db_1.DrizzleModule.register({
                databaseURL: process.env.DATABASE_URL,
            }),
            sqs_module_1.SQSModule,
        ],
        controllers: [captures_controller_1.default],
        providers: [captures_repo_1.default, captures_services_1.default],
    })
], CapturesModule);


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const openapi = __webpack_require__(5);
const common_1 = __webpack_require__(3);
const captures_repo_1 = __webpack_require__(9);
const captures_dto_1 = __webpack_require__(18);
const swagger_1 = __webpack_require__(5);
const captures_services_1 = __webpack_require__(19);
let CapturesController = class CapturesController {
    constructor(capturesRepo, captureServices) {
        this.capturesRepo = capturesRepo;
        this.captureServices = captureServices;
    }
    async findAllCaptures() {
        return this.capturesRepo.findAll();
    }
    async findCaptureById(id) {
        return this.capturesRepo.findOneById(id);
    }
    async createCapture(newCapture) {
        return this.captureServices.createCapture(newCapture);
    }
};
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CapturesController.prototype, "findAllCaptures", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CapturesController.prototype, "findCaptureById", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [captures_dto_1.CreateCapture]),
    __metadata("design:returntype", Promise)
], CapturesController.prototype, "createCapture", null);
CapturesController = __decorate([
    (0, swagger_1.ApiTags)('captures'),
    (0, common_1.Controller)('captures'),
    __metadata("design:paramtypes", [captures_repo_1.default,
        captures_services_1.default])
], CapturesController);
exports["default"] = CapturesController;


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CaptureStatus = void 0;
const drizzle_db_1 = __webpack_require__(10);
const common_1 = __webpack_require__(3);
const drizzle_db_2 = __webpack_require__(10);
const drizzle_orm_1 = __webpack_require__(17);
var CaptureStatus;
(function (CaptureStatus) {
    CaptureStatus["PENDING"] = "pending";
    CaptureStatus["COMPLETED"] = "completed";
    CaptureStatus["FAILED"] = "failed";
})(CaptureStatus || (exports.CaptureStatus = CaptureStatus = {}));
let CapturesRepo = class CapturesRepo {
    constructor(drizzle) {
        this.drizzle = drizzle;
    }
    async create(newCapture) {
        return this.drizzle.drizzleClient
            .insert(drizzle_db_2.dbSchema.captures)
            .values(newCapture)
            .returning();
    }
    async findOneById(id) {
        const result = await this.drizzle.drizzleClient
            .select()
            .from(drizzle_db_2.dbSchema.captures)
            .where((0, drizzle_orm_1.eq)(drizzle_db_2.dbSchema.captures.id, id))
            .execute();
        return result[0];
    }
    async findAll() {
        return this.drizzle.drizzleClient
            .select()
            .from(drizzle_db_2.dbSchema.captures)
            .execute();
    }
};
CapturesRepo = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_db_1.DrizzleService])
], CapturesRepo);
exports["default"] = CapturesRepo;


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dbSchema = void 0;
__exportStar(__webpack_require__(11), exports);
__exportStar(__webpack_require__(12), exports);
exports.dbSchema = __webpack_require__(15);


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DrizzleModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DrizzleModule = void 0;
const common_1 = __webpack_require__(3);
const drizzle_db_service_1 = __webpack_require__(12);
const drizzle_db_constants_1 = __webpack_require__(14);
let DrizzleModule = DrizzleModule_1 = class DrizzleModule {
    static register(options) {
        return {
            module: DrizzleModule_1,
            providers: [
                {
                    provide: drizzle_db_constants_1.DRIZZLE_DB_OPTIONS,
                    useValue: options,
                },
                drizzle_db_service_1.DrizzleService,
            ],
            exports: [drizzle_db_service_1.DrizzleService],
        };
    }
};
exports.DrizzleModule = DrizzleModule;
exports.DrizzleModule = DrizzleModule = DrizzleModule_1 = __decorate([
    (0, common_1.Module)({
        providers: [drizzle_db_service_1.DrizzleService],
        exports: [drizzle_db_service_1.DrizzleService],
    })
], DrizzleModule);


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DrizzleService = void 0;
const common_1 = __webpack_require__(3);
const node_postgres_1 = __webpack_require__(13);
const drizzle_db_constants_1 = __webpack_require__(14);
let DrizzleService = class DrizzleService {
    constructor(options) {
        this.databaseURL = options.databaseURL;
    }
    async onModuleInit() {
        this.drizzleClient = (0, node_postgres_1.drizzle)(this.databaseURL);
        console.log(this.databaseURL);
        console.log('Drizzle client connected to the database');
    }
};
exports.DrizzleService = DrizzleService;
exports.DrizzleService = DrizzleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_db_constants_1.DRIZZLE_DB_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], DrizzleService);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("drizzle-orm/node-postgres");

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DRIZZLE_DB_OPTIONS = void 0;
exports.DRIZZLE_DB_OPTIONS = Symbol.for('DRIZZLE_DB_OPTIONS');


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.users = exports.captures = void 0;
const pg_core_1 = __webpack_require__(16);
exports.captures = (0, pg_core_1.pgTable)("captures", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey().notNull(),
    url: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: 'string' }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: 'string' }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)("deleted_at", { mode: 'string' }),
    status: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
});
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey().notNull(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    age: (0, pg_core_1.integer)().notNull(),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: 'string' }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: 'string' }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)("deleted_at", { mode: 'string' }),
}, (table) => {
    return {
        usersEmailUnique: (0, pg_core_1.unique)("users_email_unique").on(table.email),
    };
});


/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("drizzle-orm/pg-core");

/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("drizzle-orm");

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCapture = void 0;
const openapi = __webpack_require__(5);
class CreateCapture {
    static _OPENAPI_METADATA_FACTORY() {
        return { url: { required: true, type: () => String } };
    }
}
exports.CreateCapture = CreateCapture;


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(3);
const captures_repo_1 = __webpack_require__(9);
const message_queue_1 = __webpack_require__(20);
const lodash_1 = __webpack_require__(25);
let CapturesServices = class CapturesServices {
    constructor(capturesRepo, sqsService) {
        this.capturesRepo = capturesRepo;
        this.sqsService = sqsService;
    }
    async createCapture(newCapture) {
        const capture = await this.capturesRepo.create({
            ...newCapture,
            status: captures_repo_1.CaptureStatus.PENDING,
        });
        await this.sqsService.sendMessage({
            captureId: (0, lodash_1.first)(capture).id,
        });
        return (0, lodash_1.first)(capture);
    }
};
CapturesServices = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [captures_repo_1.default,
        message_queue_1.MessageQueueService])
], CapturesServices);
exports["default"] = CapturesServices;


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(21), exports);
__exportStar(__webpack_require__(22), exports);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MessageQueueModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageQueueModule = void 0;
const common_1 = __webpack_require__(3);
const message_queue_service_1 = __webpack_require__(22);
const message_queue_constant_1 = __webpack_require__(24);
let MessageQueueModule = MessageQueueModule_1 = class MessageQueueModule {
    static register(config) {
        return {
            module: MessageQueueModule_1,
            providers: [
                {
                    provide: message_queue_constant_1.MESSAGE_QUEUE_OPTIONS,
                    useValue: config,
                },
                message_queue_service_1.MessageQueueService,
            ],
            exports: [message_queue_service_1.MessageQueueService],
        };
    }
};
exports.MessageQueueModule = MessageQueueModule;
exports.MessageQueueModule = MessageQueueModule = MessageQueueModule_1 = __decorate([
    (0, common_1.Module)({})
], MessageQueueModule);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageQueueService = void 0;
const common_1 = __webpack_require__(3);
const client_sqs_1 = __webpack_require__(23);
const message_queue_constant_1 = __webpack_require__(24);
let MessageQueueService = class MessageQueueService {
    constructor(config) {
        console.log('config :>> ', config);
        this.config = config;
        this.queueUrl = config.queueUrl;
    }
    onModuleInit() {
        this.sqsClient = new client_sqs_1.SQSClient(this.config);
    }
    sendMessage(message) {
        const stringifyMsg = typeof message === 'string' ? message : JSON.stringify(message);
        const command = new client_sqs_1.SendMessageCommand({
            QueueUrl: this.queueUrl,
            MessageBody: stringifyMsg,
            DelaySeconds: 0,
        });
        return this.sqsClient.send(command);
    }
};
exports.MessageQueueService = MessageQueueService;
exports.MessageQueueService = MessageQueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(message_queue_constant_1.MESSAGE_QUEUE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], MessageQueueService);


/***/ }),
/* 23 */
/***/ ((module) => {

module.exports = require("@aws-sdk/client-sqs");

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MESSAGE_QUEUE_OPTIONS = void 0;
exports.MESSAGE_QUEUE_OPTIONS = Symbol.for('OPTIONS');


/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SQSModule = void 0;
const message_queue_1 = __webpack_require__(20);
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(6);
const getSQSConfig = () => {
    return !(process.env.NODE_ENV === 'production')
        ? {
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            queueUrl: process.env.AWS_QUEUE_URL,
        }
        : {
            queueUrl: process.env.AWS_QUEUE_URL,
        };
};
let SQSModule = class SQSModule {
};
exports.SQSModule = SQSModule;
exports.SQSModule = SQSModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            message_queue_1.MessageQueueModule.register(getSQSConfig()),
        ],
        exports: [message_queue_1.MessageQueueModule],
    })
], SQSModule);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const web_capture_module_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(5);
async function bootstrap() {
    const app = await core_1.NestFactory.create(web_capture_module_1.WebCaptureModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Capture example')
        .setDescription('The Capture API description')
        .setVersion('1.0')
        .addTag('Capture')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('swagger', app, documentFactory);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

})();

/******/ })()
;