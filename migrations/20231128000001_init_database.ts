import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Create users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('username', 255).notNullable().unique()
    table.string('email', 255).notNullable().unique()
    table.string('password', 255).notNullable()
    table.string('role', 50).notNullable().defaultTo('user')
    table.string('status', 50).notNullable().defaultTo('active')
    table.string('avatar_url', 500).nullable()
    table.string('avatar_id', 255).nullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  // Create topics table
  await knex.schema.createTable('topics', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name', 255).notNullable()
    table.string('status', 50).notNullable().defaultTo('active')
  })

  // Create study_sets table
  await knex.schema.createTable('study_sets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable()
    table.uuid('topic_id').nullable()
    table.string('title', 255).notNullable()
    table.text('description').notNullable()
    table.string('icon', 100).nullable()
    table.boolean('is_public').defaultTo(false)
    table.integer('number_of_flashcards').defaultTo(0)
    table.string('status', 50).notNullable().defaultTo('active')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('topic_id').references('id').inTable('topics').onDelete('SET NULL')
    table.index('user_id')
    table.index('topic_id')
  })

  // Create media table
  await knex.schema.createTable('media', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name', 255).nullable()
    table.string('image_url', 500).nullable()
    table.string('image_id', 255).nullable()
    table.boolean('is_public').notNullable().defaultTo(false)
    table.string('status', 50).notNullable().defaultTo('active')
  })

  // Create flashcards table
  await knex.schema.createTable('flashcards', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('media_id').nullable()
    table.integer('position').nullable()
    table.uuid('study_set_id').notNullable()
    table.text('term').notNullable()
    table.text('definition').notNullable()
    table.string('status', 50).notNullable().defaultTo('active')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('media_id').references('id').inTable('media').onDelete('SET NULL')
    table.foreign('study_set_id').references('id').inTable('study_sets').onDelete('CASCADE')
    table.index('media_id')
    table.index('study_set_id')
  })

  // Create user_learns table (moved up before difficulties)
  await knex.schema.createTable('user_learns', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable()
    table.uuid('study_set_id').notNullable()
    table.integer('processing').notNullable().defaultTo(0)
    table.string('status', 50).notNullable().defaultTo('in_progress')

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('study_set_id').references('id').inTable('study_sets').onDelete('CASCADE')
    table.index('user_id')
    table.index('study_set_id')
  })

  // Create difficulties table
  await knex.schema.createTable('difficulties', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_learn_id').notNullable()
    table.string('name', 50).notNullable()
    table.integer('minutes').notNullable()

    table.foreign('user_learn_id').references('id').inTable('user_learns').onDelete('CASCADE')
    table.index('user_learn_id')
  })

  // Create folder_sets table
  await knex.schema.createTable('folder_sets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable()
    table.string('icon', 100).nullable()
    table.string('title', 255).notNullable()
    table.text('description').notNullable()
    table.integer('number_of_study_sets').defaultTo(0)
    table.string('status', 50).notNullable().defaultTo('active')

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.index('user_id')
  })

  // Create folder_study_sets table (many-to-many relationship)
  await knex.schema.createTable('folder_study_sets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('folder_set_id').notNullable()
    table.uuid('study_set_id').notNullable()
    table.string('status', 50).notNullable().defaultTo('active')

    table.foreign('folder_set_id').references('id').inTable('folder_sets').onDelete('CASCADE')
    table.foreign('study_set_id').references('id').inTable('study_sets').onDelete('CASCADE')
    table.index('folder_set_id')
    table.index('study_set_id')
  })

  // Create reviews table
  await knex.schema.createTable('reviews', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable()
    table.uuid('study_set_id').notNullable()
    table.integer('rating').notNullable()
    table.text('comment').nullable()

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('study_set_id').references('id').inTable('study_sets').onDelete('CASCADE')
    table.index('user_id')
    table.index('study_set_id')
  })

  // Create learn_flashcards table
  await knex.schema.createTable('learn_flashcards', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_learn_id').notNullable()
    table.uuid('flashcard_id').notNullable()
    table.boolean('is_learned').notNullable().defaultTo(false)
    table.uuid('difficulty_id').nullable()
    table.timestamp('next_review_at').nullable()
    table.timestamp('last_reviewed_at').nullable()

    table.foreign('user_learn_id').references('id').inTable('user_learns').onDelete('CASCADE')
    table.foreign('flashcard_id').references('id').inTable('flashcards').onDelete('CASCADE')
    table.foreign('difficulty_id').references('id').inTable('difficulties').onDelete('CASCADE')
    table.index('user_learn_id')
    table.index('flashcard_id')
    table.index('difficulty_id')
  })

  // Create user_logs table
  await knex.schema.createTable('user_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable().unique()
    table.integer('record_streaks').notNullable().defaultTo(0)
    table.integer('longest_streaks').notNullable().defaultTo(0)
    table.timestamp('last_login_at').nullable()

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.index('user_id')
  })

  // Note: user_tests and test_flashcards tables are deprecated
  // They have been removed in favor of runtime-only test generation
  // See migration 20231213000001_add_interactions_and_stats.ts
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_logs')
  await knex.schema.dropTableIfExists('test_flashcards')
  await knex.schema.dropTableIfExists('user_tests')
  await knex.schema.dropTableIfExists('learn_flashcards')
  await knex.schema.dropTableIfExists('difficulties')
  await knex.schema.dropTableIfExists('user_learns')
  await knex.schema.dropTableIfExists('reviews')
  await knex.schema.dropTableIfExists('folder_study_sets')
  await knex.schema.dropTableIfExists('folder_sets')
  await knex.schema.dropTableIfExists('flashcards')
  await knex.schema.dropTableIfExists('media')
  await knex.schema.dropTableIfExists('study_sets')
  await knex.schema.dropTableIfExists('topics')
  await knex.schema.dropTableIfExists('users')
}
