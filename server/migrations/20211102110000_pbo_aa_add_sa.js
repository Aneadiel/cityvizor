exports.up = async function (knex) {
  return knex.schema.dropTable('data.pbo_aa_names').then(() => {
    return knex.schema
      .createTable('data.pbo_aa_names', table => {
        table.integer('profile_id');
        table
          .foreign('profile_id')
          .references('id')
          .inTable('app.profiles')
          .onUpdate('cascade')
          .onDelete('cascade');
        table.integer('year');
        table
          .foreign(['year', 'profile_id'])
          .references(['year', 'profile_id'])
          .inTable('app.years')
          .onUpdate('cascade')
          .onDelete('cascade');
        table.integer('aa');
        table.integer('sa');
        table.text('name');
      })
      .then(() => {
        // For some reason, using.primary() did not work because of the autogenerated constraint name
        // Adding the constraint manually
        return knex.schema.raw(
          'alter table "data"."pbo_aa_names" add constraint "data.pbo_aa_names_pkey" primary key ("profile_id", "year", "aa", "sa")'
        );
      });
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('data.pbo_aa_names').then(() => {
    return knex.schema
      .createTable('data.pbo_aa_names', table => {
        table.integer('profile_id');
        table
          .foreign('profile_id')
          .references('id')
          .inTable('app.profiles')
          .onUpdate('cascade')
          .onDelete('cascade');
        table.integer('year');
        table
          .foreign(['year', 'profile_id'])
          .references(['year', 'profile_id'])
          .inTable('app.years')
          .onUpdate('cascade')
          .onDelete('cascade');
        table.integer('aa');
        table.text('name');
      })
      .then(() => {
        // For some reason, using.primary() did not work because of the autogenerated constraint name
        // Adding the constraint manually
        return knex.schema.raw(
          'alter table "data"."pbo_aa_names" add constraint "data.pbo_aa_names_pkey" primary key ("profile_id", "year", "aa")'
        );
      });
  });
};
