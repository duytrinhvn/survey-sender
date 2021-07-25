import React from "react";
import { connect } from "react-redux";
import formFields from "./formFields";
import { submitSurvey } from "../../redux/surveys/surveys.actions";
import { withRouter } from "react-router-dom";

const SurveyFormReview = ({
  onBackToForm,
  formValues,
  submitSurvey,
  history,
}) => {
  return (
    <div>
      <h5>Please confirm your entries</h5>
      <div>
        {formFields.map(({ name, label }) => {
          return (
            <div key={name}>
              <label>{label}</label>
              <div>{formValues[name]}</div>
            </div>
          );
        })}
      </div>
      <button
        className="yellow white-text darken-3 btn-flat"
        onClick={onBackToForm}
      >
        Back
      </button>
      <button
        onClick={() => submitSurvey(formValues, history)}
        className="green white-text btn-flat right"
      >
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formValues: form.surveyForm.values,
  };
};

export default connect(mapStateToProps, { submitSurvey })(
  withRouter(SurveyFormReview)
);
