import { FETCH_USER } from "../auth/auth.types";
import SurveysActionTypes from "./surveys.types";
import axios from "axios";

export const submitSurvey = (values, history) => async (dispatch) => {
  const res = await axios.post("/api/surveys", values);

  dispatch({ type: FETCH_USER, payload: res.data });

  history.push("/surveys");
};

export const fetchSurveys = () => async (dispatch) => {
  const res = await axios.get("/api/surveys");

  dispatch({ type: SurveysActionTypes.FETCH_SURVEYS, payload: res.data });
};

export const deleteSurveyStart = (surveyId) => async (dispatch) => {
  try {
    dispatch({ type: SurveysActionTypes.DELETE_SURVEYS_START });

    const res = await axios.delete("/api/surveys/delete", {
      data: { surveyId },
    });

    dispatch({
      type: SurveysActionTypes.DELETE_SURVEYS_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: SurveysActionTypes.DELETE_SURVEYS_FAILURE,
      payload: error.message,
    });
  }
};
