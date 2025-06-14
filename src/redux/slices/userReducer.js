import { getFromLS } from "../../Utils/storage";
const initialState = {
  mode:
    getFromLS("vegan-theme") &&
    (getFromLS("vegan-theme") === "light" ||
      getFromLS("vegan-theme") === "dark")
      ? getFromLS("vegan-theme")
      : "light",
  account: "",
  position: "",
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_THEME":
      return {
        ...state,
        mode: action.payload,
      };
    case "SET_ACCOUNT":
      return {
        ...state,
        account: action.payload,
      };
    case "SET_POSITION":
      return {
        ...state,
        position: action.payload,
      };
    case "RESET_ACCOUNT":
      return {
        ...state,
        account: "",
        position: "GUEST",
      };
    default:
      return state;
  }
};

export default userReducer;
