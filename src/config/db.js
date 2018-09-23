import Dexie from "dexie";

const db = new Dexie("FormBuilderDB");
db.version(1).stores({
  formFields:
    "++id,parentId,inputType,question,answerType,condition,conditionValue"
});

export default db;
