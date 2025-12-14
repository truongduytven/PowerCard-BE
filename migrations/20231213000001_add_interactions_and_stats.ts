import { Knex } from 'knex';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function up(knex: Knex): Promise<void> {
  // ===== DROP DEPRECATED TABLES =====
  // Remove old test-related tables that are no longer needed
  await knex.schema.dropTableIfExists('test_flashcards');
  await knex.schema.dropTableIfExists('user_tests');

  // ===== CREATE NEW TABLES =====
  
  // 1. Create study_set_interactions table
  await knex.schema.createTable('study_set_interactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('study_set_id').notNullable();
    table.uuid('user_id').nullable(); // Allow NULL for guest views
    table.enum('type', ['view', 'favorite', 'clone', 'share']).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('study_set_id').references('id').inTable('study_sets').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Indexes for performance
    table.index('study_set_id');
    table.index('user_id');
    table.index('type');
    table.index('created_at');
  });

  // Create partial unique constraint for favorite/clone/share (not for views)
  await knex.raw(`
    CREATE UNIQUE INDEX study_set_interactions_favorite_unique 
    ON study_set_interactions (study_set_id, user_id, type) 
    WHERE type IN ('favorite', 'clone', 'share') AND user_id IS NOT NULL
  `);

  // 2. Create study_set_stats table
  await knex.schema.createTable('study_set_stats', (table) => {
    table.uuid('study_set_id').primary();
    table.integer('views').notNullable().defaultTo(0);
    table.integer('favorites').notNullable().defaultTo(0);
    table.integer('clones').notNullable().defaultTo(0);
    table.integer('shares').notNullable().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign key
    table.foreign('study_set_id').references('id').inTable('study_sets').onDelete('CASCADE');
  });

  // Initialize stats for existing study sets
  await knex.raw(`
    INSERT INTO study_set_stats (study_set_id, views, favorites, clones, shares)
    SELECT id, 0, 0, 0, 0 FROM study_sets
  `);

  // ===== SEED DATA =====
  
  // Get all existing study sets
  const studySets = await knex('study_sets').select('id');

  if (studySets.length > 0) {
    // Update stats with random values
    for (const studySet of studySets) {
      await knex('study_set_stats')
        .where('study_set_id', studySet.id)
        .update({
          views: Math.floor(Math.random() * 500) + 50, // 50-550 views
          favorites: Math.floor(Math.random() * 100) + 10, // 10-110 favorites
          clones: Math.floor(Math.random() * 30) + 5, // 5-35 clones
          shares: Math.floor(Math.random() * 50) + 5, // 5-55 shares
        });
    }

    // Insert sample interactions for first 5 study sets
    const users = await knex('users').select('id').limit(3);
    
    if (users.length > 0) {
      const interactions = [];
      const maxStudySets = Math.min(5, studySets.length);
      
      for (let i = 0; i < maxStudySets; i++) {
        const studySetId = studySets[i].id;
        
        // Add view interactions (including guest views)
        for (let v = 0; v < 3; v++) {
          interactions.push({
            study_set_id: studySetId,
            user_id: v < 2 ? users[v % users.length].id : null, // Last one is guest
            type: 'view',
            created_at: knex.raw(`NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days'`)
          });
        }
        
        // Add favorite interactions (only registered users)
        for (let u = 0; u < Math.min(2, users.length); u++) {
          interactions.push({
            study_set_id: studySetId,
            user_id: users[u].id,
            type: 'favorite',
            created_at: knex.raw(`NOW() - INTERVAL '${Math.floor(Math.random() * 20)} days'`)
          });
        }
        
        // Add clone interaction
        if (users.length > 0) {
          interactions.push({
            study_set_id: studySetId,
            user_id: users[0].id,
            type: 'clone',
            created_at: knex.raw(`NOW() - INTERVAL '${Math.floor(Math.random() * 15)} days'`)
          });
        }
        
        // Add share interaction
        if (users.length > 1) {
          interactions.push({
            study_set_id: studySetId,
            user_id: users[1].id,
            type: 'share',
            created_at: knex.raw(`NOW() - INTERVAL '${Math.floor(Math.random() * 10)} days'`)
          });
        }
      }

      if (interactions.length > 0) {
        await knex('study_set_interactions').insert(interactions);
      }
    }

    console.log(`✅ Dropped deprecated tables: user_tests, test_flashcards`);
    console.log(`✅ Created new tables: study_set_interactions, study_set_stats`);
    console.log(`✅ Seeded stats for ${studySets.length} study sets`);
    console.log(`✅ Seeded sample interactions for ${Math.min(5, studySets.length)} study sets`);
  }
}

export async function down(knex: Knex): Promise<void> {
  // Drop new tables
  await knex.schema.dropTableIfExists('study_set_interactions');
  await knex.schema.dropTableIfExists('study_set_stats');

  // Recreate old tables (for rollback compatibility)
  await knex.schema.createTable('user_tests', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.uuid('study_set_id').notNullable();
    table.integer('num_questions').notNullable();
    table.integer('minutes').notNullable();
    table.integer('score').nullable();
    table.string('status', 50).notNullable().defaultTo('in_progress');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('study_set_id').references('id').inTable('study_sets').onDelete('CASCADE');
    table.index('user_id');
    table.index('study_set_id');
  });

  await knex.schema.createTable('test_flashcards', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_test_id').notNullable();
    table.uuid('flashcard_id').notNullable();
    table.text('user_answer').nullable();

    table.foreign('user_test_id').references('id').inTable('user_tests').onDelete('CASCADE');
    table.foreign('flashcard_id').references('id').inTable('flashcards').onDelete('CASCADE');
    table.index('user_test_id');
    table.index('flashcard_id');
  });
}
