import { RelationMappings, Model } from "objection";
import BaseModel from "./BaseModel";

export interface IFolderStudySet {
  id: string;
  folderSetId: string;
  studySetId: string;
  status: string;
}

export default class FolderStudySets
  extends BaseModel
  implements IFolderStudySet
{
  id!: string;
  folderSetId!: string;
  studySetId!: string;
  status!: string;

  public tableName = "folder_study_sets";

  public relationMappings: RelationMappings = {
    folderset: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require("./FolderSets").default,
      join: {
        from: "folder_study_sets.folderSetId",
        to: "folder_sets.id",
      },
    },
    studyset: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require("./StudySets").default,
      join: {
        from: "folder_study_sets.studySetId",
        to: "study_sets.id",
      },
    },
  };
}
