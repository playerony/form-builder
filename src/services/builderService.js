import db from "../config/db";
import inputTypes from "../config/inputTypes";
import formTypes from "../config/formTypes";

import formFieldsToJSON from "../utils/formFieldsToJSON";
import fetchConditionsByFormType from "../utils/fetchConditionsByFormType";

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
    condition: fetchConditionValue(parentAnswerType)
  };

  return await db.formFields.add(newFormField);
}

function fetchConditionValue(parentAnswerType) {
  const result = fetchConditionsByFormType(parentAnswerType);

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
