import { Knex } from 'knex'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  // Note: test_flashcards and user_tests tables no longer exist (deprecated)
  await knex('study_set_interactions').del()
  await knex('study_set_stats').del()
  await knex('user_logs').del()
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
      icon: '📚',
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
      icon: '💻',
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
      icon: '🔢',
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
      icon: '📖',
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
      is_public: true,
      status: 'active',
    },
    {
      id: mediaId2,
      name: 'Sample Image 2',
      image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      image_id: 'unsplash_002',
      is_public: true,
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
      icon: null,
      title: 'My English Collection',
      description: 'Collection of English study sets',
      number_of_study_sets: 1,
      status: 'active',
    },
    {
      id: folderSetId2,
      user_id: userId1,
      icon: null,
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

  // ===== NEW: Insert study_set_stats =====
  await knex('study_set_stats').insert([
    {
      study_set_id: studySetId1,
      views: 156,
      favorites: 23,
      clones: 8,
      shares: 12,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      study_set_id: studySetId2,
      views: 243,
      favorites: 45,
      clones: 15,
      shares: 18,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      study_set_id: studySetId3,
      views: 89,
      favorites: 12,
      clones: 5,
      shares: 7,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      study_set_id: studySetId4,
      views: 312,
      favorites: 67,
      clones: 22,
      shares: 31,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ])

  // ===== NEW: Insert study_set_interactions =====
  await knex('study_set_interactions').insert([
    // Views - including guest views (user_id = null)
    {
      id: uuidv4(),
      study_set_id: studySetId1,
      user_id: userId1,
      type: 'view',
      created_at: knex.raw("NOW() - INTERVAL '2 days'"),
    },
    {
      id: uuidv4(),
      study_set_id: studySetId1,
      user_id: userId2,
      type: 'view',
      created_at: knex.raw("NOW() - INTERVAL '1 day'"),
    },
    {
      id: uuidv4(),
      study_set_id: studySetId1,
      user_id: null, // Guest view
      type: 'view',
      created_at: knex.raw("NOW() - INTERVAL '5 hours'"),
    },
    {
      id: uuidv4(),
      study_set_id: studySetId2,
      user_id: userId3,
      type: 'view',
      created_at: knex.raw("NOW() - INTERVAL '3 days'"),
    },
    {
      id: uuidv4(),
      study_set_id: studySetId2,
      user_id: null, // Guest view
      type: 'view',
      created_at: knex.raw("NOW() - INTERVAL '1 hour'"),
    },

    // Favorites
    {
      id: uuidv4(),
      study_set_id: studySetId1,
      user_id: userId2,
      type: 'favorite',
      created_at: knex.raw("NOW() - INTERVAL '5 days'"),
    },
    {
      id: uuidv4(),
      study_set_id: studySetId1,
      user_id: userId3,
      type: 'favorite',
      created_at: knex.raw("NOW() - INTERVAL '3 days'"),
    },
    {
      id: uuidv4(),
      study_set_id: studySetId2,
      user_id: userId1,
      type: 'favorite',
      created_at: knex.raw("NOW() - INTERVAL '7 days'"),
    },
    {
      id: uuidv4(),
      study_set_id: studySetId3,
      user_id: userId2,
      type: 'favorite',
      created_at: knex.raw("NOW() - INTERVAL '2 days'"),
    },
    {
      id: uuidv4(),
      study_set_id: studySetId4,
      user_id: userId1,
      type: 'favorite',
      created_at: knex.raw("NOW() - INTERVAL '4 days'"),
    },

    // Clones
    {
      id: uuidv4(),
      study_set_id: studySetId1,
      user_id: userId3,
      type: 'clone',
      created_at: knex.raw("NOW() - INTERVAL '10 days'"),
    },
    {
      id: uuidv4(),
      study_set_id: studySetId2,
      user_id: userId2,
      type: 'clone',
      created_at: knex.raw("NOW() - INTERVAL '8 days'"),
    },
    {
      id: uuidv4(),
      study_set_id: studySetId4,
      user_id: userId1,
      type: 'clone',
      created_at: knex.raw("NOW() - INTERVAL '6 days'"),
    },

    // Shares
    {
      id: uuidv4(),
      study_set_id: studySetId1,
      user_id: userId1,
      type: 'share',
      created_at: knex.raw("NOW() - INTERVAL '4 days'"),
    },
    {
      id: uuidv4(),
      study_set_id: studySetId2,
      user_id: userId3,
      type: 'share',
      created_at: knex.raw("NOW() - INTERVAL '2 days'"),
    },
    {
      id: uuidv4(),
      study_set_id: studySetId2,
      user_id: null, // Guest share
      type: 'share',
      created_at: knex.raw("NOW() - INTERVAL '1 day'"),
    },
    {
      id: uuidv4(),
      study_set_id: studySetId4,
      user_id: userId2,
      type: 'share',
      created_at: knex.raw("NOW() - INTERVAL '3 days'"),
    },
  ])

  // Insert user_learns cho john@example.com với 2 study sets
  const userLearnId1 = uuidv4()
  const userLearnId2 = uuidv4()

  await knex('user_learns').insert([
    {
      id: userLearnId1,
      userId: userId1,
      studySetId: studySetId1, // English Vocabulary
      processing: 2,
      status: 'active',
    },
    {
      id: userLearnId2,
      userId: userId1,
      studySetId: studySetId2, // JavaScript Fundamentals
      processing: 1,
      status: 'active',
    },
  ])

  // Insert difficulties (phải có user_learn_id)
  const difficultyEasy = uuidv4()
  const difficultyMedium = uuidv4()
  const difficultyHard = uuidv4()

  await knex('difficulties').insert([
    {
      id: difficultyEasy,
      user_learn_id: userLearnId1,
      name: 'Easy',
      minutes: 10,
    },
    {
      id: difficultyMedium,
      user_learn_id: userLearnId1,
      name: 'Medium',
      minutes: 5,
    },
    {
      id: difficultyHard,
      user_learn_id: userLearnId2,
      name: 'Hard',
      minutes: 2,
    },
  ])

  // Insert user_logs - mỗi user chỉ có 1 record (unique constraint)
  await knex('user_logs').insert([
    {
      id: uuidv4(),
      user_id: userId1,
      record_streaks: 7,
      longest_streaks: 15,
      last_login_at: knex.raw("NOW()"),
    },
    {
      id: uuidv4(),
      user_id: userId2,
      record_streaks: 3,
      longest_streaks: 8,
      last_login_at: knex.raw("NOW() - INTERVAL '2 days'"),
    },
    {
      id: uuidv4(),
      user_id: userId3,
      record_streaks: 1,
      longest_streaks: 15,
      last_login_at: knex.raw("NOW() - INTERVAL '3 days'"),
    },
  ])

  // Insert learn_flashcards với dữ liệu học tập đa dạng qua nhiều ngày
  // Mỗi flashcard chỉ xuất hiện 1 lần trong learn_flashcards (unique constraint)
  await knex('learn_flashcards').insert([
    // Study Set 1: English Vocabulary - 3 flashcards với thời gian học đa dạng
    // Flashcard 1 - studied hôm nay lúc 9AM, mastered (Easy)
    {
      id: uuidv4(),
      user_learn_id: userLearnId1,
      flashcard_id: flashcardId1,
      difficulty_id: difficultyEasy,
      next_review_at: knex.raw("NOW() + INTERVAL '7 days'"),
      last_reviewed_at: knex.raw("DATE_TRUNC('day', NOW()) + INTERVAL '9 hours'"),
    },
    // Flashcard 2 - studied hôm qua lúc 8PM, Medium difficulty
    {
      id: uuidv4(),
      user_learn_id: userLearnId1,
      flashcard_id: flashcardId2,
      difficulty_id: difficultyMedium,
      next_review_at: knex.raw("NOW() + INTERVAL '3 days'"),
      last_reviewed_at: knex.raw("DATE_TRUNC('day', NOW() - INTERVAL '1 day') + INTERVAL '20 hours'"),
    },
    // Flashcard 3 - studied 2 ngày trước lúc 2PM, Easy
    {
      id: uuidv4(),
      user_learn_id: userLearnId1,
      flashcard_id: flashcardId3,
      difficulty_id: difficultyEasy,
      next_review_at: knex.raw("NOW() + INTERVAL '7 days'"),
      last_reviewed_at: knex.raw("DATE_TRUNC('day', NOW() - INTERVAL '2 days') + INTERVAL '14 hours'"),
    },

    // Study Set 2: JavaScript Fundamentals - 3 flashcards
    // Flashcard 4 - studied hôm nay lúc 10AM, Hard
    {
      id: uuidv4(),
      user_learn_id: userLearnId2,
      flashcard_id: flashcardId4,
      difficulty_id: difficultyHard,
      next_review_at: knex.raw("NOW() + INTERVAL '1 day'"),
      last_reviewed_at: knex.raw("DATE_TRUNC('day', NOW()) + INTERVAL '10 hours'"),
    },
    // Flashcard 5 - studied 3 ngày trước lúc 3PM, Medium
    {
      id: uuidv4(),
      user_learn_id: userLearnId2,
      flashcard_id: flashcardId5,
      difficulty_id: difficultyMedium,
      next_review_at: knex.raw("NOW() + INTERVAL '3 days'"),
      last_reviewed_at: knex.raw("DATE_TRUNC('day', NOW() - INTERVAL '3 days') + INTERVAL '15 hours'"),
    },
    // Flashcard 6 - studied 4 ngày trước lúc 9PM, Easy
    {
      id: uuidv4(),
      user_learn_id: userLearnId2,
      flashcard_id: flashcardId6,
      difficulty_id: difficultyEasy,
      next_review_at: knex.raw("NOW() + INTERVAL '7 days'"),
      last_reviewed_at: knex.raw("DATE_TRUNC('day', NOW() - INTERVAL '4 days') + INTERVAL '21 hours'"),
    },

    // Study Set 3: Thêm flashcards từ Mathematics - Algebra (userId2 owns it, nhưng userId1 học)
    // Flashcard 7 - studied 5 ngày trước lúc 7AM, Medium
    {
      id: uuidv4(),
      user_learn_id: userLearnId1,
      flashcard_id: flashcardId7,
      difficulty_id: difficultyMedium,
      next_review_at: knex.raw("NOW() + INTERVAL '3 days'"),
      last_reviewed_at: knex.raw("DATE_TRUNC('day', NOW() - INTERVAL '5 days') + INTERVAL '7 hours'"),
    },
    // Flashcard 8 - studied 6 ngày trước lúc 11AM, Easy
    {
      id: uuidv4(),
      user_learn_id: userLearnId1,
      flashcard_id: flashcardId8,
      difficulty_id: difficultyEasy,
      next_review_at: knex.raw("NOW() + INTERVAL '7 days'"),
      last_reviewed_at: knex.raw("DATE_TRUNC('day', NOW() - INTERVAL '6 days') + INTERVAL '11 hours'"),
    },
  ])
}
