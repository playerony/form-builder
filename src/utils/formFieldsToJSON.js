import inputTypes from "../config/inputTypes";

function fetchNestedChildren(formFields, parentId) {
  let result = [];

  for (let i in formFields) {
    if (formFields[i].parentId === parentId) {
      const children = fetchNestedChildren(formFields, formFields[i].id);

      if (children.length) formFields[i].children = children;

      result.push(formFields[i]);
    }
  }

  return result;
}

function fetchMailFields(formFields) {
  return formFields.filter(formField => formField.inputType === inputTypes[0]);
}

export default (formFields = []) => {
  const mainFields = fetchMailFields(formFields);

  mainFields.map(mainField => {
    mainField.children = fetchNestedChildren(formFields, mainField.id);

    return mainField;
  });

  return mainFields;
};
