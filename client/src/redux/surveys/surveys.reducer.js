import SurveysActionTypes from "./surveys.types";

const INITIAL_STATE = {
  surveys: [],
  isDeleting: false,
  errorMessage: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SurveysActionTypes.FETCH_SURVEYS:
      return {
        ...state,
        surveys: action.payload,
      };
    case SurveysActionTypes.DELETE_SURVEYS_START:
      return {
        ...state,
        isDeleting: true,
        errorMessage: null,
      };
    case SurveysActionTypes.DELETE_SURVEYS_SUCCESS:
      return {
        ...state,
        isDeleting: false,
        errorMessage: null,
        surveys: state.surveys
          .filter((survey) => {
            return survey._id !== action.payload;
          })
          .reverse(),
      };
    case SurveysActionTypes.DELETE_SURVEYS_FAILURE:
      return {
        ...state,
        isDeleting: false,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};
