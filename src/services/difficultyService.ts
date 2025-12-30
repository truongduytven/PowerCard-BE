import Difficulties from "../models/Difficulties";

interface IDifficultyConfig {
  userLearnId: string;
  difficulties: {
    name: string;
    minutes: number;
  }[];
}

class DifficultyService {
  async configureDifficulties(config: IDifficultyConfig) {
    await Promise.all(config.difficulties.map((difficulty) =>
      Difficulties.query().patch({ minutes: difficulty.minutes })
        .where('userLearnId', config.userLearnId)
        .andWhere('name', difficulty.name)
    ));
    return true;
  }

  async getDifficultiesConfig(userLearnId: string) {
    const difficulties = await Difficulties.query()
      .where('userLearnId', userLearnId)
      .select('id', 'name', 'minutes')
      .orderBy('minutes', 'asc');
    return difficulties;
  }
}

export default new DifficultyService();