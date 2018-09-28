import React, { Component } from "react";
import PropTypes from "prop-types";
import { slideInLeft } from "react-animations";
import { keyframes } from "styled-components";
import Waypoint from "react-waypoint";

import formTypes from "../../config/formTypes";
import inputTypes from "../../config/inputTypes";

import fetchConditionsByFormType from "../../utils/fetchConditionsByFormType";
import fetchAnswersByFormType from "../../utils/fetchAnswersByFormType";

import "./FormField.scss";

class FormField extends Component {
  state = {
    animation: false
  };

  onChange(e) {
    const { id, onUpdate, onConditionChange } = this.props;

    const data = { [e.target.name]: e.target.value };

    const type = formTypes[2].type;
    const typeAnswers = fetchAnswersByFormType(type);

    if (e.target.name === "answerType")
      onConditionChange(id, data, {
        conditionValue: e.target.value === type ? typeAnswers[0] : null
      });

    onUpdate(id, data);
  }

  renderSelectTypeContent() {
    const { id, answerType } = this.props;

    return (
      <div className="form-field--form--field">
        <label className="form-field--form--field--label">Type</label>

        <select
          className="form-field--form--field--input form-field--form--field--select"
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

    const answers = fetchAnswersByFormType(parentAnswerType);

    if (answers)
      return (
        <select
          className="form-field--form--field--input form-field--form--field--select"
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
      const conditions = fetchConditionsByFormType(parentAnswerType);

      return (
        <div className="form-field--form--field">
          <label className="form-field--form--field--label">Condition</label>

          <select
            className="form-field--form--field--input form-field--form--field--select"
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

  handleOnInsert = e => {
    e.preventDefault();

    const { id, parentAnswerType, onInsert } = this.props;

    onInsert(inputTypes[1], id, parentAnswerType);
  };

  handleOnDelete = () => {
    const { id, onDelete } = this.props;

    onDelete(id);
  };

  handleContentAnimationChange = () => {
    this.setState({
      animation: true
    });
  };

  render() {
    const { question, padding } = this.props;

    const slideInLeftAnimation = keyframes`${slideInLeft}`;

    return (
      <div className="form-field-wrapper">
        <Waypoint onEnter={this.handleContentAnimationChange}>
          <div
            className="form-field-content"
            style={{
              paddingLeft: padding * 75,
              animation: this.state.animation
                ? `3s ${slideInLeftAnimation}`
                : ``
            }}
          >
            <form className="form-field--form">
              {this.renderConditionFields()}

              <div className="form-field--form--field">
                <label className="form-field--form--field--label">
                  Question
                </label>

                <input
                  type="text"
                  name="question"
                  className="form-field--form--field--input"
                  value={question}
                  onChange={e => this.onChange(e)}
                />
              </div>

              {this.renderSelectTypeContent()}

              <input
                type="submit"
                value="Delete"
                className="form-field--form--field--button"
                onClick={this.handleOnDelete}
              />

              <input
                type="submit"
                value="Add Sub-Input"
                className="form-field--form--field--button"
                onClick={this.handleOnInsert}
              />
            </form>
          </div>
        </Waypoint>
      </div>
    );
  }
}

FormField.propTypes = {
  conditionValue: PropTypes.string,
  question: PropTypes.string,
  condition: PropTypes.string,
  id: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  inputType: PropTypes.string.isRequired,
  parentAnswerType: PropTypes.string.isRequired,
  answerType: PropTypes.string.isRequired,
  onInsert: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onConditionChange: PropTypes.func.isRequired
};

export default FormField;
