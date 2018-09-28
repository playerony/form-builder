import formTypes from "../config/formTypes";

export default parentAnswerType => {
  if (!parentAnswerType) return;

  const result = formTypes.filter(
    formType => formType.type === parentAnswerType
  );

  return result ? result[0].conditions : null;
};
