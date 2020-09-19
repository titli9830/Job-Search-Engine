import { useReducer, useEffect } from 'react';
//import Switch from 'react-bootstrap/esm/Switch';
import axios from 'axios';

const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json'
//const BASE_URL='https://api.allorigins.win/raw?url=https://jobs.github.com/positions.json'
//const BASE_URL = 'https://jobs.github.com/positions.json'
//const BASE_URL = '/positions.json'

const ACTIONS = {
    MAKE_REQUEST: 'make-request',
    GET_DATA: 'get-data',
    ERROR: 'error',
    UPDATE_HAS_NEXT_PAGE: 'update-has-next-page'
}
// everytime when we call dispatch, reducer function gets called & in dispatch whatever we pass , populated inside action.
// state is the current state of the 
function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.MAKE_REQUEST:
            return { loading: true, jobs: [] }

        case ACTIONS.GET_DATA:
            return { ...state, loading: false, jobs: action.payload.jobs }

        case ACTIONS.ERROR:
            return { ...state, loading: false, error: action.payload.error, jobs: [] }

        case ACTIONS.UPDATE_HAS_NEXT_PAGE:
            return { ...state, hasNextPage: action.payload.hasNextPage }

        default:
            return state
    }
}

// everytime when we call dispatch, reducer function gets called & in dispatch whatever we pass , populated inside action. 
//in Dispatch-> type & payload passed. type is type of action & payload is the value of the type
export default function useFetchJobs(params, page) {
    const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true })

    useEffect(() => {
        const cancelToken1 = axios.CancelToken.source()
        dispatch({ type: ACTIONS.MAKE_REQUEST })
        axios.get(BASE_URL, {
            cancelToken: cancelToken1.token,
            params: { markdown: true, page: page, ...params }
        }).then(res => {
            dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } })
        }).catch(e => {
            if (axios.isCancel(e)) return
            dispatch({ type: ACTIONS.ERROR, payload: { error: e } })
        })

        const cancelToken2 = axios.CancelToken.source()
        axios.get(BASE_URL, {
            cancelToken: cancelToken2.token,
            params: { markdown: true, page: page + 1, ...params }
        }).then(res => {
            dispatch({ type: ACTIONS.UPDATE_HAS_NEXT_PAGE, payload: { hasNextPage: res.data.length !== 0 } })
        }).catch(e => {
            if (axios.isCancel(e)) return
            dispatch({ type: ACTIONS.ERROR, payload: { error: e } })
        })

        return () => {
            cancelToken1.cancel()
            cancelToken2.cancel()
        }
    }, [params, page])

    return state
}

//export default useFetchJobs;