/* import { createAction } from 'redux-actions';

export const setLangageActionName = createAction('SET_LANGUAGE');

export const setLanguage = ({ lang }) => async (dispatch) => {
  const response = await axios.post(routes.tasksUrl(), { task });
  dispatch(setLangageActionName({ task: response.data }));
};

export const removeTask = ({ id }) => async (dispatch) => {
  dispatch(removeTaskRequest());
  try {
    const url = routes.taskUrl(id);
    await axios.delete(url);
    dispatch(removeTaskSuccess({ id }));
  } catch (e) {
    dispatch(removeTaskFailure());
    throw e;
  }
};
// END
*/
export const setOptions = () => ({
  type: 'SET_OPTIONS',
});

export const setLanguage = (lang) => ({
  type: 'SET_LANGUAGE',
  payload: lang,
});
