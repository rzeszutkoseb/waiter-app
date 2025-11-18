import { API_URL } from '../config';

// SELECTORS
export const getAllTables = ({ tables }) => tables.data;
export const getTableById = ({ tables }, tableId) =>
  tables.data.find(table => table.id === tableId);
export const getTablesRequest = ({ tables }) => tables.request;

// ACTIONS
const createActionName = actionName => `app/tables/${actionName}`;

const LOAD_TABLES = createActionName('LOAD_TABLES');
const UPDATE_TABLE = createActionName('UPDATE_TABLE');
const START_REQUEST = createActionName('START_REQUEST');
const END_REQUEST = createActionName('END_REQUEST');
const ERROR_REQUEST = createActionName('ERROR_REQUEST');

// ACTION CREATORS
export const loadTables = payload => ({ type: LOAD_TABLES, payload });
export const updateTable = payload => ({ type: UPDATE_TABLE, payload });
export const startRequest = () => ({ type: START_REQUEST });
export const endRequest = () => ({ type: END_REQUEST });
export const errorRequest = payload => ({ type: ERROR_REQUEST, payload });

// THUNKS
export const fetchTables = () => {
  return dispatch => {
    dispatch(startRequest());

    fetch(`${API_URL}/tables`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        dispatch(loadTables(data));
        dispatch(endRequest());
      })
      .catch(err => {
        dispatch(errorRequest(err.message || true));
      });
  };
};

export const updateTableRequest = table => {
  return dispatch => {
    dispatch(startRequest());

    fetch(`${API_URL}/tables/${table.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(table),
    })
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(() => {
        dispatch(updateTable(table));
        dispatch(endRequest());
      })
      .catch(err => {
        dispatch(errorRequest(err.message || true));
      });
  };
};

// REDUCER
const initialStatePart = {
  data: [],
  request: {
    pending: false,
    error: null,
    success: null,
  },
};

const tablesReducer = (statePart = initialStatePart, action) => {
  switch (action.type) {
    case LOAD_TABLES:
      return {
        ...statePart,
        data: [...action.payload],
      };

    case UPDATE_TABLE:
      return {
        ...statePart,
        data: statePart.data.map(table =>
          table.id === action.payload.id ? { ...action.payload } : table
        ),
      };

    case START_REQUEST:
      return {
        ...statePart,
        request: { pending: true, error: null, success: false },
      };

    case END_REQUEST:
      return {
        ...statePart,
        request: { pending: false, error: null, success: true },
      };

    case ERROR_REQUEST:
      return {
        ...statePart,
        request: { pending: false, error: action.payload || true, success: false },
      };

    default:
      return statePart;
  }
};

export default tablesReducer;
