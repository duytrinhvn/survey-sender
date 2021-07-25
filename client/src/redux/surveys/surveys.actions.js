import { FETCH_USER } from "../auth/auth.types";
import { FETCH_SURVEYS } from "./surveys.types";
import axios from "axios";

export const submitSurvey = (values, history) => async (dispatch) => {
  const res = await axios.post("/api/surveys", values);

  dispatch({ type: FETCH_USER, payload: res.data });

  history.push("/surveys");
};

export const fetchSurveys = () => async (dispatch) => {
  const res = await axios.get("/api/surveys");

  dispatch({ type: FETCH_SURVEYS, payload: res.data });
};
