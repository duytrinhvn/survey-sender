import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import reducers from "./root-reducer";

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

export default store;