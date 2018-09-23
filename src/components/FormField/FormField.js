import React, { Component } from "react";

import formTypes from "../../config/formTypes";
import inputTypes from "../../config/inputTypes";

import "./FormField.scss";

class FormField extends Component {
  onChange(e, id) {
    const { onUpdate } = this.props;

    onUpdate(id, { [e.target.name]: e.target.value });
  }

  renderSelectTypeContent() {
    const { id, answerType } = this.props;

    return (
      <select name="answerType" onChange={e => this.onChange(e, id)}>
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
    );
  }

  renderConditionFields() {
    const { inputType } = this.props;

    if (inputType === inputTypes[1]) {
      return <div>Condition input type</div>;
    }
  }

  render() {
    const { id, question, onInsert, onDelete, padding } = this.props;

    return (
      <div className="form-field-wrapper">
        <div
          className="form-field-content"
          style={{ paddingLeft: padding * 15 }}
        >
          <form className="form-field-form">
            {this.renderConditionFields()}
            Question
            <input
              type="text"
              name="question"
              value={question}
              onChange={e => this.onChange(e, id)}
            />
            {this.renderSelectTypeContent()}
            <input
              type="submit"
              value="Add Sub-Input"
              onClick={() => onInsert(inputTypes[1], id)}
            />
            <input type="submit" value="Delete" onClick={() => onDelete(id)} />
          </form>
        </div>
      </div>
    );
  }
}

export default FormField;
