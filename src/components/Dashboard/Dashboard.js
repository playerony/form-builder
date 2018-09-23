import React, { Component } from "react";
import FormField from "../FormField/FormField";

import {
  fetchFormFields,
  fetchFormFieldByParentId,
  insertFormField,
  updateFormField,
  deleteFormField
} from "../../services/builderService";

import formTypes from "../../config/formTypes";
import "./Dashboard.scss";

class Dashboard extends Component {
  state = {
    formFields: []
  };

  componentDidMount() {
    this.loadFormFields();
  }

  async loadFormFields() {
    this.setState({
      formFields: await fetchFormFields()
    });
  }

  handleAddNewFormField = async (inputType, parentId, parentAnswerType) => {
    const result = await insertFormField(inputType, parentId, parentAnswerType);

    if (result) await this.loadFormFields();
  };

  handleConditionChange = async (id, data) => {
    const formField = await fetchFormFieldByParentId(id);

    await updateFormField(formField.id, {
      condition: formTypes[0].conditions[0],
      conditionValue: null
    });

    await this.handleUpdateFormField(id, data);
  };

  handleUpdateFormField = async (id, data) => {
    await updateFormField(id, data);
    await this.loadFormFields();
  };

  handleDeleteFormField = async id => {
    await deleteFormField(id);
    await this.loadFormFields();
  };

  fetchNestedChildren(formFields = [], answerType, padding = 0) {
    let result = [];

    for (let i in formFields) {
      formFields[i].padding = padding;

      result.push(
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
        result.push(
          this.fetchNestedChildren(
            formFields[i].children,
            formFields[i].answerType,
            padding + 1
          )
        );
      }
    }

    return result;
  }

  renderContent() {
    const { formFields } = this.state;

    if (Object.keys(formFields).length > 0)
      return this.fetchNestedChildren(formFields, formFields[0].answerType);
  }

  render() {
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
