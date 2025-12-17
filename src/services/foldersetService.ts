import FolderSets from "../models/FolderSets";
import StudySets from "../models/StudySets";
import FolderStudySets from "../models/FolderStudySets";

class FolderSetService {
  async getAllFolderSets(userId: string) {
    const result = await FolderSets.query()
      .where("userId", userId)
      .where("status", "active")
      .select("id", "icon", "title", "description", "number_of_study_sets");

    return result;
  }

  async getFolderSetById(folderSetId: string, userId: string) {
    const folderSet = await FolderSets.query()
      .where("id", folderSetId)
      .andWhere("userId", userId)
      .andWhere("status", "active")
      .first();

    if (!folderSet) {
      throw { status: 404, message: "Không tìm thấy bộ thư mục" };
    }

    const studySets = await StudySets.query()
      .alias("ss")
      .innerJoin("folder_study_sets as fss", "ss.id", "fss.study_set_id")
      .innerJoin("users", "ss.userId", "users.id")
      .innerJoin("topics", "ss.topicId", "topics.id")
      .where("fss.folder_set_id", folderSetId)
      .andWhere("fss.status", "active")
      .select(
        "ss.id",
        "ss.title",
        "ss.description",
        "topics.name as topic_name",
        "ss.is_public",
        "users.username",
        "users.avatar_url",
        "ss.number_of_flashcards",
        "ss.created_at",
        "ss.updated_at"
      );

    return {
      id: folderSet.id,
      title: folderSet.title,
      description: folderSet.description,
      studySets: studySets,
    };
  }

  async createFolderSet(userId: string, title: string, description: string, icon: string | null, studySets: string[]) {
    if (!title || !description || !Array.isArray(studySets)) {
      throw { status: 400, message: "Yêu cầu không hợp lệ" };
    }

    const newFolderSet = await FolderSets.query().insert({
      userId,
      title,
      icon,
      description,
      numberOfStudySets: studySets.length || 0,
      status: "active",
    });

    await Promise.all(studySets.map((studySetId: string) => 
      FolderStudySets.query().insert({
        folderSetId: newFolderSet.id,
        studySetId,
        status: "active",
      })
    ));

    return newFolderSet;
  }

  async updateFolderSet(
    id: string, 
    userId: string, 
    title?: string, 
    description?: string, 
    studySets?: string[]
  ) {
    const folderSet = await FolderSets.query()
      .where("id", id)
      .andWhere("userId", userId)
      .andWhere("status", "active")
      .first();

    if (!folderSet) {
      throw { status: 404, message: "Không tìm thấy bộ thư mục" };
    }

    await FolderSets.transaction(async (trx) => {
      await FolderSets.query(trx).patchAndFetchById(id, {
        title: title || folderSet.title,
        description: description || folderSet.description,
        numberOfStudySets: studySets?.length || folderSet.numberOfStudySets,
      });

      if (Array.isArray(studySets)) {
        const existingRelations = await FolderStudySets.query(trx)
          .where("folderSetId", id);

        const activeRelations = existingRelations.filter((rel) => rel.status === "active");
        const inactiveRelations = existingRelations.filter((rel) => rel.status === "inactive");
        const activeStudySetIds = activeRelations.map((rel) => rel.studySetId);
        const inactiveStudySetIds = inactiveRelations.map((rel) => rel.studySetId);
        const newStudySetIds = studySets as string[];

        const toReactivate = newStudySetIds.filter(
          (studySetId) => inactiveStudySetIds.includes(studySetId)
        );
        const toAdd = newStudySetIds.filter(
          (studySetId) => !activeStudySetIds.includes(studySetId) && !inactiveStudySetIds.includes(studySetId)
        );
        const toDeactivate = activeStudySetIds.filter(
          (studySetId) => !newStudySetIds.includes(studySetId)
        );

        if (toReactivate.length > 0) {
          await FolderStudySets.query(trx)
            .whereIn("studySetId", toReactivate)
            .andWhere("folderSetId", id)
            .patch({ status: "active" });
        }

        if (toAdd.length > 0) {
          await Promise.all(
            toAdd.map((studySetId) =>
              FolderStudySets.query(trx).insert({
                folderSetId: id,
                studySetId,
                status: "active",
              })
            )
          );
        }

        if (toDeactivate.length > 0) {
          await FolderStudySets.query(trx)
            .whereIn("studySetId", toDeactivate)
            .andWhere("folderSetId", id)
            .patch({ status: "inactive" });
        }
      }
    });
  }

  async deleteFolderSet(id: string, userId: string) {
    const folderSet = await FolderSets.query()
      .where("id", id)
      .andWhere("userId", userId)
      .andWhere("status", "active")
      .first();

    if (!folderSet) {
      throw { status: 404, message: "Không tìm thấy bộ thư mục" };
    }

    await FolderSets.query()
      .where("id", id)
      .patch({ status: "inactive" });
  }
}

export default new FolderSetService();
