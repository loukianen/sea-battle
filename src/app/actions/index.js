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

export const fetchTasks = () => async (dispatch) => {
  dispatch(fetchTasksRequest());
  try {
    const url = routes.tasksUrl();
    const response = await axios.get(url);
    dispatch(fetchTasksSuccess({ tasks: response.data }));
  } catch (e) {
    dispatch(fetchTasksFailure());
    throw e;
  }
}; */
export const setLanguage = (lang) => ({
  type: 'SET_LANGUAGE',
  payload: lang,
});
