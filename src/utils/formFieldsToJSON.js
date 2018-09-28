import inputTypes from "../config/inputTypes";

function fetchNestedChildren(formFields, parentId) {
  let result = [];

  for (const i in formFields) {
    if (formFields[i].parentId === parentId) {
      const children = fetchNestedChildren(formFields, formFields[i].id);

      if (children.length) formFields[i].children = children;

      result.push(formFields[i]);
    }
  }

  return result;
}

function fetchMainFields(formFields) {
  return formFields.filter(formField => formField.inputType === inputTypes[0]);
}

export default (formFields = []) => {
  const mainFields = fetchMainFields(formFields);

  mainFields.map(mainField => {
    mainField.children = fetchNestedChildren(formFields, mainField.id);

    return mainField;
  });

  return mainFields;
};
