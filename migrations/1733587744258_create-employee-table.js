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
    const typeEmployee = 'type_employee'

    pgm.createType(typeEmployee, ['admin', 'default'])

    pgm.createTable('employee', {
        id: { type: 'uuid', primaryKey: true, notNull: true },
        type: { type: typeEmployee, notNull: true, default: 'default' },
        name: { type: "text", notNull: true },
        password: { type: "text", notNull: true },
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
    pgm.dropTable('employee')
};
