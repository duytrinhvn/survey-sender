import React, { Component } from "react";
import SurveyForm from "./SurveyForm";
import SurveyFormReview from "./SurveyFormReview";
import { reduxForm } from "redux-form";

class SurveyNew extends Component {
  state = {
    showReview: false,
  };

  renderContent() {
    if (this.state.showReview === false) {
      return (
        <SurveyForm
          onSurveyFormSubmit={() => this.setState({ showReview: true })}
        />
      );
    } else {
      return (
        <SurveyFormReview
          onBackToForm={() => this.setState({ showReview: false })}
        />
      );
    }
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default reduxForm({ form: "surveyForm" })(SurveyNew);
