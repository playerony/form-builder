import db from "../config/db";
import inputTypes from "../config/inputTypes";
import formTypes from "../config/formTypes";

import formFieldsToJSON from "../utils/formFieldsToJSON";
import getConditionsByFormType from "../utils/getConditionsByFormType";

export async function fetchFormFields() {
  const result = await await db.formFields.toArray();

  return formFieldsToJSON(result);
}

export async function insertFormField(
  inputType = inputTypes[0],
  parentId,
  parentAnswerType
) {
  const newFormField = {
    inputType,
    parentId,
    answerType: formTypes[0].type,
    condition: getConditionValue(parentAnswerType)
  };

  return await db.formFields.add(newFormField);
}

function getConditionValue(parentAnswerType) {
  const result = getConditionsByFormType(parentAnswerType);

  return result ? result[0] : null;
}

export async function updateFormField(id, data) {
  return await db.formFields.update(id, data);
}

export async function deleteFormField(id) {
  let currentParentId = id;

  await db.formFields.delete(id);

  while (1) {
    const formField = await this.fetchFormFieldByParentId(currentParentId);

    if (!formField) break;
    currentParentId = formField.id;

    await db.formFields.delete(formField.id);
  }
}

export async function fetchFormFieldByParentId(parentId) {
  return await db.formFields.where({ parentId }).first({});
}
