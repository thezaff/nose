import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1714661000000 implements MigrationInterface {
    name = 'AddIndexes1714661000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add indexes to improve knowledge graph query performance

        // Node indexes
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_NODE_USER" ON "node" ("userId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_NODE_CREATED_AT" ON "node" ("createdAt")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_NODE_UPDATED_AT" ON "node" ("updatedAt")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_NODE_TITLE" ON "node" USING GIN (to_tsvector('english', "title"))`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_NODE_CONTENT" ON "node" USING GIN (to_tsvector('english', "content"))`);

        // Link indexes
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_LINK_SOURCE_NODE" ON "link" ("sourceNodeId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_LINK_TARGET_NODE" ON "link" ("targetNodeId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_LINK_TYPE" ON "link" ("type")`);

        // NodeSuperTag indexes
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_NODE_SUPER_TAG_NODE" ON "node_super_tag" ("nodeId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_NODE_SUPER_TAG_SUPER_TAG" ON "node_super_tag" ("superTagId")`);

        // FieldValue indexes
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_FIELD_VALUE_NODE" ON "field_value" ("nodeId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_FIELD_VALUE_FIELD" ON "field_value" ("fieldId")`);

        // Conversation and Message indexes
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_CONVERSATION_USER" ON "conversation" ("userId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_MESSAGE_CONVERSATION" ON "message" ("conversationId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_MESSAGE_CREATED_AT" ON "message" ("createdAt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove indexes
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_NODE_USER"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_NODE_CREATED_AT"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_NODE_UPDATED_AT"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_NODE_TITLE"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_NODE_CONTENT"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_LINK_SOURCE_NODE"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_LINK_TARGET_NODE"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_LINK_TYPE"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_NODE_SUPER_TAG_NODE"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_NODE_SUPER_TAG_SUPER_TAG"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_FIELD_VALUE_NODE"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_FIELD_VALUE_FIELD"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_CONVERSATION_USER"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_MESSAGE_CONVERSATION"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_MESSAGE_CREATED_AT"`);
    }
}