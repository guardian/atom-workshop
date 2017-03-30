export default function formErrors(state = {}, action) {

  var formName, newFormErrors, currentFormErrors, updatedFormErrors, updatedForm;
  switch (action.type) {
    case 'FORM_ERRORS_UPDATE_REQUEST':
      formName = Object.keys(action.error)[0];
      newFormErrors = action.error[formName];
      currentFormErrors = state[formName] || {};
      updatedFormErrors = Object.assign({}, currentFormErrors, newFormErrors);
      updatedForm = {[formName]: updatedFormErrors};
      return Object.assign({}, state, updatedForm);

    default:
      return state;
  }
}
