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
exports.NodeSuperTag = void 0;
const typeorm_1 = require("typeorm");
const Node_1 = require("./Node");
const SuperTag_1 = require("./SuperTag");
let NodeSuperTag = class NodeSuperTag {
};
exports.NodeSuperTag = NodeSuperTag;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NodeSuperTag.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], NodeSuperTag.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Node_1.Node, node => node.nodeSuperTags),
    (0, typeorm_1.JoinColumn)({ name: 'nodeId' }),
    __metadata("design:type", Node_1.Node)
], NodeSuperTag.prototype, "node", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NodeSuperTag.prototype, "nodeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SuperTag_1.SuperTag, superTag => superTag.nodeSuperTags),
    (0, typeorm_1.JoinColumn)({ name: 'superTagId' }),
    __metadata("design:type", SuperTag_1.SuperTag)
], NodeSuperTag.prototype, "superTag", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NodeSuperTag.prototype, "superTagId", void 0);
exports.NodeSuperTag = NodeSuperTag = __decorate([
    (0, typeorm_1.Entity)()
], NodeSuperTag);
//# sourceMappingURL=NodeSuperTag.js.map