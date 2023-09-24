// ** Reducers Imports
import layout from "./layout";
import navbar from "./navbar";
import authentication from "../views/authentication/store";

const rootReducer = { 
    navbar,
    layout,
    authentication,
};

export default rootReducer;
