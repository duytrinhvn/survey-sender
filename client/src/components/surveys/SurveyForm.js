import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import SurveyField from "./SurveyField";
import { Link } from "react-router-dom";
import validateEmails from "../../utils/validateEmails";
import formFields from "./formFields";

class SurveyForm extends Component {
  renderFields = () => {
    return (
      <div>
        {formFields.map(({ label, name }, i) => {
          return (
            <Field
              key={i}
              type="text"
              label={label}
              name={name}
              component={SurveyField}
            />
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveyFormSubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  errors.recipients = validateEmails(values.recipients);

  formFields.forEach(({ name }) => {
    if (!values[name]) {
      errors[name] = `${name} is required`;
    }
  });

  return errors;
}

export default reduxForm({
  form: "surveyForm",
  validate,
  destroyOnUnmount: false,
})(SurveyForm);
