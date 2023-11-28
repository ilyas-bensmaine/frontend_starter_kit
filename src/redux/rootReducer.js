// ** Reducers Imports
import layout from "./layout";
import navbar from "./navbar";
import authentication from "../views/authentication/store";
import users from '../views/users/store'

const rootReducer = { 
    navbar,
    layout,
    authentication,
    users,
};

export default rootReducer;
