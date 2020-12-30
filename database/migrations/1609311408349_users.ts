import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import * as Knex from 'knex';

export default class Users extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table: Knex.TableBuilder) => {
      table.increments('id').primary();
      table.text('name').notNullable();
      table.dateTime('birthday').notNullable();
      table.string('email').unique().notNullable();
      table.text('password').notNullable();
      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
