export const API_ROUTES = {
  PETS: {
    GET_PET: {
      URL: (id: number) => `/pets/${id}`,
      METHOD: 'GET',
    },
    GET_PETS: {
      URL: '/pets',
      METHOD: 'GET',
    },
    CREATE_PET: {
      URL: '/pets',
      METHOD: 'POST',
    },
    DELETE_PET: {
      URL: (id: number) => `/pets/${id}`,
      METHOD: 'DELETE',
    },
    UPDATE_PET: {
      URL: (id: number) => `/pets/${id}`,
      METHOD: 'PATCH',
    },
    ACTIVATE_PET: {
      URL: (id: number) => `/pets/${id}/activate`,
      METHOD: 'PATCH',
    },
  },
  MISSIONS: {
    GET_TODAY: {
      URL: '/missions/today',
      METHOD: 'GET',
    },
    GET_HISTORY: {
      URL: '/missions/submissions/history',
      METHOD: 'GET',
    },
    SUBMIT: {
      URL: (missionId: number) => `/missions/${missionId}/submissions`,
      METHOD: 'POST',
    },
    DELETE_SUBMISSION: {
      URL: (missionId: number, submissionId: number) =>
        `/missions/${missionId}/submissions/${submissionId}`,
      METHOD: 'DELETE',
    },
  },
  FEEDS: {
    GET_FEED: {
      URL: (id: number) => `/feeds/${id}`,
      METHOD: 'GET',
    },
    GET_FEEDS: {
      URL: '/feeds',
      METHOD: 'GET',
    },
    ADD_LIKE: {
      URL: (submissionId: number) => `/feeds/${submissionId}/likes`,
      METHOD: 'POST',
    },
    REMOVE_LIKE: {
      URL: (submissionId: number) => `/feeds/${submissionId}/likes`,
      METHOD: 'DELETE',
    },
    GET_COMMENTS: {
      URL: (submissionId: number) => `/feeds/${submissionId}/comments`,
      METHOD: 'GET',
    },
    CREATE_COMMENT: {
      URL: (submissionId: number) => `/feeds/${submissionId}/comments`,
      METHOD: 'POST',
    },
    DELETE_COMMENT: {
      URL: (submissionId: number, commentId: number) =>
        `/feeds/${submissionId}/comments/${commentId}`,
      METHOD: 'DELETE',
    },
  },
  RANKINGS: {
    GET_RANKINGS: {
      URL: '/rankings',
      METHOD: 'GET',
    },
  },
} as const;
