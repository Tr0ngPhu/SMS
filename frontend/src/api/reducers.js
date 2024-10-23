const initialState = {
    students: {
        allStudent: [],
        error: null,
    },
};

const studentReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_STUDENT_SUCCESS':
            return {
                ...state,
                students: {
                    ...state.students,
                    allStudent: state.students.allStudent.map(student =>
                        student._id === action.payload._id ? action.payload : student
                    ),
                },
            };
        case 'UPDATE_STUDENT_FAILURE':
            return {
                ...state,
                students: {
                    ...state.students,
                    error: action.payload,
                },
            };
        default:
            return state;
    }
};

export default studentReducer;