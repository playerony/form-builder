import React, { Component } from "react";

import formTypes from "../../config/formTypes";
import inputTypes from "../../config/inputTypes";
import getConditionsByFormType from "../../utils/getConditionsByFormType";
import getAnswersByFormType from "../../utils/getAnswersByFormType";

import "./FormField.scss";

class FormField extends Component {
  onChange(e, id) {
    const { onUpdate, onConditionChange } = this.props;

    if (e.target.name === "answerType")
      onConditionChange(id, { conditionValue: "Yes", [e.target.name]: e.target.value });
    else 
      onUpdate(id, { [e.target.name]: e.target.value });
  }

  renderSelectTypeContent() {
    const { id, answerType } = this.props;

    return (
      <div className="form-field--form--field">
        <label className="form-field--form--field--label">Type</label>
        <select
          className="form-field--form--field--input"
          name="answerType"
          onChange={e => this.onChange(e, id)}
        >
          {formTypes.map(formType => {
            return (
              <option
                selected={answerType === formType.type}
                key={formType.type}
                value={formType.type}
              >
                {formType.type}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  renderConditionValueField() {
    const { id, conditionValue, parentAnswerType } = this.props;

    const answers = getAnswersByFormType(parentAnswerType);

    if (answers)
      return (
        <select
          className="form-field--form--field--input"
          name="conditionValue"
          onChange={e => this.onChange(e, id)}
        >
          {answers.map(answer => {
            return (
              <option
                selected={conditionValue === answer}
                key={answer}
                value={answer}
              >
                {answer}
              </option>
            );
          })}
        </select>
      );

    return (
      <input
        type="text"
        name="conditionValue"
        className="form-field--form--field--input"
        value={conditionValue}
        onChange={e => this.onChange(e, id)}
      />
    );
  }

  renderConditionFields() {
    const { id, inputType, condition, parentAnswerType } = this.props;

    if (inputType === inputTypes[1]) {
      const conditions = getConditionsByFormType(parentAnswerType);

      return (
        <div className="form-field--form--field">
          <label className="form-field--form--field--label">Condition</label>
          <select
            className="form-field--form--field--input"
            name="condition"
            onChange={e => this.onChange(e, id)}
          >
            {conditions.map(value => {
              return (
                <option
                  selected={condition === value}
                  key={value}
                  value={value}
                >
                  {value}
                </option>
              );
            })}
          </select>
          {this.renderConditionValueField()}
        </div>
      );
    }
  }

  render() {
    const {
      id,
      question,
      onInsert,
      onDelete,
      padding,
      parentAnswerType
    } = this.props;

    return (
      <div className="form-field-wrapper">
        <div
          className="form-field-content"
          style={{ paddingLeft: padding * 30 }}
        >
          <form className="form-field--form">
            {this.renderConditionFields()}
            <div className="form-field--form--field">
              <label className="form-field--form--field--label">Question</label>
              <input
                type="text"
                name="question"
                className="form-field--form--field--input"
                value={question}
                onChange={e => this.onChange(e, id)}
              />
            </div>
            {this.renderSelectTypeContent()}
            <input
              type="submit"
              value="Delete"
              className="form-field--form--field--button"
              onClick={() => onDelete(id)}
            />
            <input
              type="submit"
              value="Add Sub-Input"
              className="form-field--form--field--button"
              onClick={() => onInsert(inputTypes[1], id, parentAnswerType)}
            />
          </form>
        </div>
      </div>
    );
  }
}

export default FormField;