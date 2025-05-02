"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperTag = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Field_1 = require("./Field");
const NodeSuperTag_1 = require("./NodeSuperTag");
let SuperTag = class SuperTag {
};
exports.SuperTag = SuperTag;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SuperTag.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SuperTag.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SuperTag.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SuperTag.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SuperTag.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.superTags),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], SuperTag.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SuperTag.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Field_1.Field, field => field.superTag),
    __metadata("design:type", Array)
], SuperTag.prototype, "fields", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => NodeSuperTag_1.NodeSuperTag, nodeSuperTag => nodeSuperTag.superTag),
    __metadata("design:type", Array)
], SuperTag.prototype, "nodeSuperTags", void 0);
exports.SuperTag = SuperTag = __decorate([
    (0, typeorm_1.Entity)()
], SuperTag);
//# sourceMappingURL=SuperTag.js.map