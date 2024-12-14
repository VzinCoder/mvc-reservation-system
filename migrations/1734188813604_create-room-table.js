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

    pgm.createType('type_room', ['SINGLE', 'DOUBLE', 'FAMILY'])
    pgm.createType('status_room', ['OCCUPIED', 'AVAILABLE', 'RESERVED'])

    pgm.createTable('room', {
        id: { type: 'uuid', primaryKey: true, notNull: true },
        daily_rate: { type: 'DECIMAL(10,2)', notNull: true },
        beds: { type: 'int', notNull: true },
        type: { type: 'type_room', notNull: true },
        bathrooms: { type: 'int', notNull: true },
        status: { type: 'status_room', default: 'AVAILABLE' },
        floor: { type: 'int', notNull: true },
        room_number: { type: 'int', notNull: true },
        room_code: { type: 'varchar(20)', unique: true, notNull: true }
    })

    pgm.createIndex('room', 'status')
    pgm.createIndex('room', 'type')
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

exports.down = (pgm) => {
    pgm.dropIndex('room', 'status')
    pgm.dropIndex('room', 'type')

    pgm.dropTable('room')

    pgm.dropType('type_room')
    pgm.dropType('status_room')
};

