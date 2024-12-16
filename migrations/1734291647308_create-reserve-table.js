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
    pgm.createType('reserve_status',['CONFIRMED','FINALIZED','CANCELLED'])

    pgm.createTable('reserve', {
        id: { type: 'uuid', primaryKey: true, notNull: true }, 
        total_price: { type: 'decimal(10,2)', notNull: true }, 
        check_in: { type: 'timestamp', notNull: true }, 
        check_out: { type: 'timestamp', notNull: true }, 
        employee_id: { type: 'uuid', notNull: true },
        customer_id: { type: 'uuid', notNull: true }, 
        room_id: { type: 'uuid', notNull: true },
        status:{type:'reserve_status',default:'CONFIRMED'},
        created_at: { type: "timestamp", default: pgm.func('current_timestamp') }
    })

    pgm.addConstraint('reserve', 'fk_reserve_employee', {
        foreignKeys: [
            {
                columns: 'employee_id',
                references: 'employee(id)',
                onDelete: 'CASCADE', 
            },
        ],
    });

    pgm.addConstraint('reserve', 'fk_reserve_customer', {
        foreignKeys: [
            {
                columns: 'customer_id',
                references: 'customer(id)',
                onDelete: 'CASCADE',
            },
        ],
    });

    pgm.addConstraint('reserve', 'fk_reserve_room', {
        foreignKeys: [
            {
                columns: 'room_id',
                references: 'room(id)',
                onDelete: 'CASCADE',
            },
        ],
    })

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => { 

    pgm.dropConstraint('reserve', 'fk_reserve_employee')
    pgm.dropConstraint('reserve', 'fk_reserve_customer')
    pgm.dropConstraint('reserve', 'fk_reserve_room')
    pgm.dropTable('reserve')

};
