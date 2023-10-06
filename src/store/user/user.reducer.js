const INITIAL_STATE = {
    currentUser: null,
}
export const USER_ACTIONS = {
    SET_CURRENT_USER: 'SET_CURRENT_USER',
};
const userReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case USER_ACTIONS.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: payload
            }
        default:
            return state;
    }
}