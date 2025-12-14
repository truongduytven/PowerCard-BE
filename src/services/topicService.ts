import Topics from "../models/Topics";

class TopicService {
  async getTopics() {
    const result = await Topics.query().where("status", "active");
    return result;
  }
}

export default new TopicService();
