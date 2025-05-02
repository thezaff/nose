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
exports.Node = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const NodeSuperTag_1 = require("./NodeSuperTag");
const FieldValue_1 = require("./FieldValue");
const Link_1 = require("./Link");
let Node = class Node {
};
exports.Node = Node;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Node.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Node.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Node.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Node.prototype, "isArchived", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Node.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Node.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Node.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.nodes),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], Node.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Node.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => NodeSuperTag_1.NodeSuperTag, nodeSuperTag => nodeSuperTag.node),
    __metadata("design:type", Array)
], Node.prototype, "nodeSuperTags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => FieldValue_1.FieldValue, fieldValue => fieldValue.node),
    __metadata("design:type", Array)
], Node.prototype, "fieldValues", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Link_1.Link, link => link.sourceNode),
    __metadata("design:type", Array)
], Node.prototype, "outgoingLinks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Link_1.Link, link => link.targetNode),
    __metadata("design:type", Array)
], Node.prototype, "incomingLinks", void 0);
exports.Node = Node = __decorate([
    (0, typeorm_1.Entity)()
], Node);
//# sourceMappingURL=Node.js.map