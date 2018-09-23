import inputTypes from "../config/inputTypes";

function getNestedChildren(formFields, parentId) {
  let result = [];

  for (let i in formFields) {
    if (formFields[i].parentId === parentId) {
      const children = getNestedChildren(formFields, formFields[i].id);

      if (children.length) formFields[i].children = children;

      result.push(formFields[i]);
    }
  }

  return result;
}

function getBaseFields(formFields = []) {
  return formFields.filter(formField => formField.inputType === inputTypes[0]);
}

export default formFields => {
  const mainFields = getBaseFields(formFields);

  mainFields.map(mainField => {
    mainField.children = getNestedChildren(formFields, mainField.id);
  });

  return mainFields;
};
