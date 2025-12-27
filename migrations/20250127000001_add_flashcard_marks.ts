import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Create flashcard_marks table
  await knex.schema.createTable('flashcard_marks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable()
    table.uuid('flashcard_id').notNullable()
    table.boolean('is_marked').notNullable().defaultTo(true)
    table.timestamp('marked_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('flashcard_id').references('id').inTable('flashcards').onDelete('CASCADE')
    
    // Unique constraint: one user can only have one mark record per flashcard
    table.unique(['user_id', 'flashcard_id'])
    
    table.index('user_id')
    table.index('flashcard_id')
    table.index('is_marked')
  })

  console.log('✅ Created flashcard_marks table')
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('flashcard_marks')
  console.log('✅ Dropped flashcard_marks table')
}
