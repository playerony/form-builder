import React, { Component } from "react";
import FormField from "../FormField/FormField";

import db from "../../config/db";
import inputTypes from "../../config/inputTypes";
import formTypes from "../../config/formTypes";
import getConditionsByFormType from "../../utils/getConditionsByFormType";
import formFieldsToJSON from "../../utils/formFieldsToJSON";
import "./Dashboard.scss";

class Dashboard extends Component {
  state = {
    formFields: []
  };

  componentDidMount() {
    this.fetchFormFields();
  }

  async fetchFormFields() {
    const formFields = await db.formFields.toArray();

    this.setState({ formFields: formFieldsToJSON(formFields) });
  }

  getConditionValue(parentAnswerType) {
    const result = getConditionsByFormType(parentAnswerType);

    return result ? result[0] : null;
  }

  handleAddNewFormField = async (
    inputType = inputTypes[0],
    parentId,
    parentAnswerType
  ) => {
    const newFormField = {
      inputType,
      parentId,
      answerType: formTypes[0].type,
      condition: this.getConditionValue(parentAnswerType)
    };

    const id = await db.formFields.add(newFormField);

    const newList = [
      ...this.state.formFields,
      Object.assign({}, newFormField, { id })
    ];

    this.setState({ formFields: newList });
  };

  handleConditionChange = async (id, data) => {
    const formField = await db.formFields.where({ parentId: id }).first({});

    await db.formFields.update(formField.id, {
      condition: formTypes[0].conditions[0],
      conditionValue: null
    });

    console.log(formField.id)

    await this.handleUpdateFormField(id, data);
  };

  handleUpdateFormField = async (id, data) => {
    await db.formFields.update(id, data);

    await this.fetchFormFields();
  };

  handleDeleteFormField = async id => {
    let currentParentId = id;

    while (1) {
      const formField = await this.fetchFormFieldByParentId(currentParentId);

      if (!formField) break;

      currentParentId = formField.id;

      db.formFields.delete(formField.id);
    }

    await db.formFields.delete(id);

    await this.fetchFormFields();
  };

  async fetchFormFieldByParentId(parentId) {
    const result = await db.formFields.where({ parentId }).first({});

    return result;
  }

  getNestedChildren(formFields, answerType, padding) {
    let out = [];
    for (let i in formFields) {
      formFields[i].padding = padding;

      out.push(
        <FormField
          key={formFields[i].id}
          {...formFields[i]}
          parentAnswerType={answerType}
          onInsert={this.handleAddNewFormField}
          onUpdate={this.handleUpdateFormField}
          onConditionChange={this.handleConditionChange}
          onDelete={this.handleDeleteFormField}
        />
      );

      if (formFields[i].children) {
        out.push(
          this.getNestedChildren(
            formFields[i].children,
            formFields[i].answerType,
            padding + 1
          )
        );
      }
    }

    return out;
  }

  renderContent() {
    const { formFields } = this.state;

    if (Object.keys(formFields).length > 0)
      return this.getNestedChildren(formFields, formFields[0].answerType, 0);
  }

  render() {
    console.log(this.state.formFields);

    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>
              Form
              <span>Builder</span>
            </h1>
          </div>
          {this.renderContent()}
          <button
            className="dashboard-content--see-more-button"
            onClick={() => this.handleAddNewFormField()}
          >
            Add Input
          </button>
        </div>
      </div>
    );
  }
}

export default Dashboard;
