import React, { Component } from "react";
import FormField from "../FormField/FormField";

import db from "../../config/db";
import inputTypes from "../../config/inputTypes";
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

  handleAddNewFormField = async (inputType = inputTypes[0], parentId) => {
    const newFormField = {
      inputType,
      parentId
    };

    const id = await db.formFields.add(newFormField);

    const newList = [
      ...this.state.formFields,
      Object.assign({}, newFormField, { id })
    ];

    this.setState({ formFields: newList });
  };

  handleUpdateFormField = async (id, data) => {
    await db.formFields.update(id, data);

    this.fetchFormFields();
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

    this.fetchFormFields();
  };

  async fetchFormFieldByParentId(parentId) {
    const result = await db.formFields.where({ parentId }).first({});

    return result;
  }

  getNestedChildren(formFields, padding) {
    let out = [];
    for (let i in formFields) {
      formFields[i].padding = padding;

      out.push(
        <FormField
          key={formFields[i].id}
          {...formFields[i]}
          onInsert={this.handleAddNewFormField}
          onUpdate={this.handleUpdateFormField}
          onDelete={this.handleDeleteFormField}
        />
      );

      if (formFields[i].children) {
        out.push(this.getNestedChildren(formFields[i].children, padding + 1));
      }
    }

    return out;
  }

  renderContent() {
    return this.getNestedChildren(this.state.formFields, 0);
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
          <button onClick={() => this.handleAddNewFormField()}>
            Add Input
          </button>
        </div>
      </div>
    );
  }
}

export default Dashboard;
