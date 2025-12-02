import { Knex } from 'knex'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('test_flashcards').del()
  await knex('user_tests').del()
  await knex('learn_flashcards').del()
  await knex('user_learns').del()
  await knex('reviews').del()
  await knex('folder_study_sets').del()
  await knex('folder_sets').del()
  await knex('flashcards').del()
  await knex('media').del()
  await knex('study_sets').del()
  await knex('topics').del()
  await knex('users').del()
  await knex('difficulties').del()

  const hashedPassword = await bcrypt.hash('123456', 10)

  // Generate UUIDs for difficulties
  const difficultyEasyId = uuidv4()
  const difficultyMediumId = uuidv4()
  const difficultyHardId = uuidv4()
  const difficultyVeryHardId = uuidv4()

  // Insert difficulties
  await knex('difficulties').insert([
    {
      id: difficultyEasyId,
      name: 'Easy',
      minutes: 1440, // 1 day
    },
    {
      id: difficultyMediumId,
      name: 'Medium',
      minutes: 720, // 12 hours
    },
    {
      id: difficultyHardId,
      name: 'Hard',
      minutes: 360, // 6 hours
    },
    {
      id: difficultyVeryHardId,
      name: 'Very Hard',
      minutes: 60, // 1 hour
    },
  ])

  // Generate UUIDs for users
  const userId1 = uuidv4()
  const userId2 = uuidv4()
  const userId3 = uuidv4()

  // Insert users
  await knex('users').insert([
    {
      id: userId1,
      username: 'john_doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'user',
      status: 'active',
      avatar_url: 'https://i.pravatar.cc/150?img=1',
      avatar_id: 'avatar_001',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: userId2,
      username: 'jane_smith',
      email: 'jane@example.com',
      password: hashedPassword,
      role: 'user',
      status: 'active',
      avatar_url: 'https://i.pravatar.cc/150?img=2',
      avatar_id: 'avatar_002',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: userId3,
      username: 'mike_wilson',
      email: 'mike@example.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      avatar_url: 'https://i.pravatar.cc/150?img=3',
      avatar_id: 'avatar_003',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ])

  // Generate UUIDs for topics
  const topicId1 = uuidv4()
  const topicId2 = uuidv4()
  const topicId3 = uuidv4()

  // Insert topics
  await knex('topics').insert([
    {
      id: topicId1,
      name: 'Language Learning',
      status: 'active',
    },
    {
      id: topicId2,
      name: 'Programming',
      status: 'active',
    },
    {
      id: topicId3,
      name: 'Mathematics',
      status: 'active',
    },
  ])

  // Generate UUIDs for study sets
  const studySetId1 = uuidv4()
  const studySetId2 = uuidv4()
  const studySetId3 = uuidv4()
  const studySetId4 = uuidv4()

  // Insert study_sets
  await knex('study_sets').insert([
    {
      id: studySetId1,
      user_id: userId1,
      topic_id: topicId1,
      title: 'English Vocabulary - Basic',
      description: 'Essential English words for beginners',
      is_public: true,
      number_of_flashcards: 3,
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: studySetId2,
      user_id: userId1,
      topic_id: topicId2,
      title: 'JavaScript Fundamentals',
      description: 'Core concepts of JavaScript programming',
      is_public: true,
      number_of_flashcards: 3,
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: studySetId3,
      user_id: userId2,
      topic_id: topicId3,
      title: 'Mathematics - Algebra',
      description: 'Basic algebra formulas and concepts',
      is_public: false,
      number_of_flashcards: 2,
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: studySetId4,
      user_id: userId3,
      topic_id: null,
      title: 'History - World War II',
      description: 'Important events and dates of WWII',
      is_public: true,
      number_of_flashcards: 2,
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ])

  // Generate UUIDs for media
  const mediaId1 = uuidv4()
  const mediaId2 = uuidv4()

  // Insert media
  await knex('media').insert([
    {
      id: mediaId1,
      name: 'Sample Image 1',
      image_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
      image_id: 'unsplash_001',
      status: 'active',
    },
    {
      id: mediaId2,
      name: 'Sample Image 2',
      image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      image_id: 'unsplash_002',
      status: 'active',
    },
  ])

  // Generate UUIDs for flashcards
  const flashcardId1 = uuidv4()
  const flashcardId2 = uuidv4()
  const flashcardId3 = uuidv4()
  const flashcardId4 = uuidv4()
  const flashcardId5 = uuidv4()
  const flashcardId6 = uuidv4()
  const flashcardId7 = uuidv4()
  const flashcardId8 = uuidv4()
  const flashcardId9 = uuidv4()
  const flashcardId10 = uuidv4()

  // Insert flashcards
  await knex('flashcards').insert([
    // English Vocabulary - Basic
    {
      id: flashcardId1,
      media_id: mediaId1,
      position: 1,
      study_set_id: studySetId1,
      term: 'Hello',
      definition: 'A greeting used when meeting someone',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: flashcardId2,
      media_id: null,
      position: 2,
      study_set_id: studySetId1,
      term: 'Goodbye',
      definition: 'A farewell expression when parting',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: flashcardId3,
      media_id: mediaId2,
      position: 3,
      study_set_id: studySetId1,
      term: 'Thank you',
      definition: 'An expression of gratitude',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    
    // JavaScript Fundamentals
    {
      id: flashcardId4,
      media_id: null,
      position: 1,
      study_set_id: studySetId2,
      term: 'Variable',
      definition: 'A container for storing data values',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: flashcardId5,
      media_id: null,
      position: 2,
      study_set_id: studySetId2,
      term: 'Function',
      definition: 'A block of code designed to perform a particular task',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: flashcardId6,
      media_id: null,
      position: 3,
      study_set_id: studySetId2,
      term: 'Array',
      definition: 'A data structure that stores multiple values',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    
    // Mathematics - Algebra
    {
      id: flashcardId7,
      media_id: null,
      position: 1,
      study_set_id: studySetId3,
      term: 'Quadratic Formula',
      definition: 'x = (-b ± √(b²-4ac)) / 2a',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: flashcardId8,
      media_id: null,
      position: 2,
      study_set_id: studySetId3,
      term: 'FOIL Method',
      definition: 'First, Outer, Inner, Last - method for multiplying binomials',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    
    // History - World War II
    {
      id: flashcardId9,
      media_id: null,
      position: 1,
      study_set_id: studySetId4,
      term: 'D-Day',
      definition: 'June 6, 1944 - Allied invasion of Normandy',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: flashcardId10,
      media_id: null,
      position: 2,
      study_set_id: studySetId4,
      term: 'Pearl Harbor',
      definition: 'December 7, 1941 - Japanese attack on US naval base',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ])

  // Generate UUIDs for folder_sets
  const folderSetId1 = uuidv4()
  const folderSetId2 = uuidv4()

  // Insert folder_sets
  await knex('folder_sets').insert([
    {
      id: folderSetId1,
      user_id: userId1,
      title: 'My English Collection',
      description: 'Collection of English study sets',
      number_of_study_sets: 1,
      status: 'active',
    },
    {
      id: folderSetId2,
      user_id: userId1,
      title: 'Programming Basics',
      description: 'Fundamental programming concepts',
      number_of_study_sets: 1,
      status: 'active',
    },
  ])

  // Insert folder_study_sets (many-to-many relationship)
  await knex('folder_study_sets').insert([
    {
      id: uuidv4(),
      folder_set_id: folderSetId1,
      study_set_id: studySetId1,
      status: 'active',
    },
    {
      id: uuidv4(),
      folder_set_id: folderSetId2,
      study_set_id: studySetId2,
      status: 'active',
    },
  ])

  // Insert reviews
  await knex('reviews').insert([
    {
      id: uuidv4(),
      user_id: userId2,
      study_set_id: studySetId1,
      rating: 5,
      comment: 'Excellent study set! Very helpful for beginners.',
    },
    {
      id: uuidv4(),
      user_id: userId3,
      study_set_id: studySetId2,
      rating: 4,
      comment: 'Good content, but could use more examples.',
    },
  ])

  // Generate UUIDs for user_learns
  const userLearnId1 = uuidv4()
  const userLearnId2 = uuidv4()

  // Insert user_learns
  await knex('user_learns').insert([
    {
      id: userLearnId1,
      user_id: userId1,
      study_set_id: studySetId1,
      processing: 50,
      status: 'in_progress',
    },
    {
      id: userLearnId2,
      user_id: userId2,
      study_set_id: studySetId2,
      processing: 75,
      status: 'in_progress',
    },
  ])

  // Insert learn_flashcards
  await knex('learn_flashcards').insert([
    {
      id: uuidv4(),
      user_learn_id: userLearnId1,
      flashcard_id: flashcardId1,
      is_learned: true,
      difficulty_id: difficultyEasyId,
      next_review_at: knex.raw("NOW() + INTERVAL '1 day'"),
      last_reviewed_at: knex.fn.now(),
    },
    {
      id: uuidv4(),
      user_learn_id: userLearnId1,
      flashcard_id: flashcardId2,
      is_learned: false,
      difficulty_id: difficultyMediumId,
      next_review_at: knex.raw("NOW() + INTERVAL '12 hours'"),
      last_reviewed_at: knex.fn.now(),
    },
    {
      id: uuidv4(),
      user_learn_id: userLearnId2,
      flashcard_id: flashcardId4,
      is_learned: true,
      difficulty_id: difficultyEasyId,
      next_review_at: knex.raw("NOW() + INTERVAL '1 day'"),
      last_reviewed_at: knex.fn.now(),
    },
  ])

  // Insert study_progress - REMOVED as model no longer exists

  // Generate UUIDs for user tests
  const userTestId1 = uuidv4()
  const userTestId2 = uuidv4()

  // Insert user_tests
  await knex('user_tests').insert([
    {
      id: userTestId1,
      user_id: userId1,
      study_set_id: studySetId2,
      num_questions: 3,
      minutes: 10,
      score: 2,
      status: 'completed',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: userTestId2,
      user_id: userId2,
      study_set_id: studySetId3,
      num_questions: 2,
      minutes: 5,
      score: null,
      status: 'in_progress',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ])

  // Insert test_flashcards
  await knex('test_flashcards').insert([
    // Test 1 - John's completed test
    {
      id: uuidv4(),
      user_test_id: userTestId1,
      flashcard_id: flashcardId4,
      user_answer: 'A container for storing data values',
    },
    {
      id: uuidv4(),
      user_test_id: userTestId1,
      flashcard_id: flashcardId5,
      user_answer: 'A block of code designed to perform a task',
    },
    {
      id: uuidv4(),
      user_test_id: userTestId1,
      flashcard_id: flashcardId6,
      user_answer: 'Wrong answer',
    },

    // Test 2 - Jane's in-progress test
    {
      id: uuidv4(),
      user_test_id: userTestId2,
      flashcard_id: flashcardId7,
      user_answer: null,
    },
    {
      id: uuidv4(),
      user_test_id: userTestId2,
      flashcard_id: flashcardId8,
      user_answer: null,
    },
  ])
}
