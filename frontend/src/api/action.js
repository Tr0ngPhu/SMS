export const updateStudentSuccess = (student) => ({
    type: 'UPDATE_STUDENT_SUCCESS',
    payload: student,
});

export const updateStudentFailure = (error) => ({
    type: 'UPDATE_STUDENT_FAILURE',
    payload: error,
});