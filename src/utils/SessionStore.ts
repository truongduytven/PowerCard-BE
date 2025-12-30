import { v4 as uuidv4 } from 'uuid';

interface StudySession {
  userId: string;
  studySetId: string;
  flashcardOrder: string[];
  currentIndex: number;
  expiresAt: number;
}

class SessionStore {
  private readonly sessions: Map<string, StudySession>;
  private readonly cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.sessions = new Map();
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 60 * 1000); // 1h
  }

  createSession(userId: string, studySetId: string, flashcardIds: string[]): string {
    const sessionId = uuidv4();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24h

    this.sessions.set(sessionId, {
      userId,
      studySetId,
      flashcardOrder: flashcardIds,
      currentIndex: 0,
      expiresAt,
    });

    return sessionId;
  }

  getSession(sessionId: string): StudySession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  updateIndex(sessionId: string, newIndex: number): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.currentIndex = newIndex;
    return true;
  }

  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(sessionId);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.sessions.clear();
  }
}

export default new SessionStore();
