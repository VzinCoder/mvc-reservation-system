/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('customer',{
        id:{ type: 'uuid', primaryKey: true, notNull: true },
        name:{type:'text',notNull:true},
        phone:{type:'char(11)',notNull:true},
        cpf: { type: 'VARCHAR(14)', notNull: true, unique: true },
        created_at: { type: "timestamp", default: pgm.func('current_timestamp') }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('customer')
};
