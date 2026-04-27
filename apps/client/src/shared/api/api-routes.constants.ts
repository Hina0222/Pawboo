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
    REPRESENTATIVE_PET: {
      URL: (id: number) => `/pets/${id}/representative`,
      METHOD: 'PATCH',
    },
    SEARCH_PETS: {
      URL: '/pets/search',
      METHOD: 'GET',
    },
  },
  POSTS: {
    GET_POSTS: {
      URL: '/posts',
      METHOD: 'GET',
    },
    GET_POST: {
      URL: (id: number) => `/posts/${id}`,
      METHOD: 'GET',
    },
    DELETE_POST: {
      URL: (id: number) => `/posts/${id}`,
      METHOD: 'DELETE',
    },
    GET_MY_POSTS: {
      URL: '/posts/me',
      METHOD: 'GET',
    },
    GET_PET_POSTS: {
      URL: (petId: number) => `/posts/pets/${petId}`,
      METHOD: 'GET',
    },
    GET_LIKED_POSTS: {
      URL: '/posts/liked',
      METHOD: 'GET',
    },
    ADD_LIKE: {
      URL: (postId: number) => `/posts/${postId}/likes`,
      METHOD: 'POST',
    },
    REMOVE_LIKE: {
      URL: (postId: number) => `/posts/${postId}/likes`,
      METHOD: 'DELETE',
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
  AUTH: {
    REFRESH: {
      URL: '/auth/refresh',
      METHOD: 'POST',
    },
    LOGOUT: {
      URL: '/auth/logout',
      METHOD: 'POST',
    },
    WITHDRAW: {
      URL: '/auth/withdraw',
      METHOD: 'DELETE',
    },
  },
  USERS: {
    GET_ME: {
      URL: '/users/me',
      METHOD: 'GET',
    },
    UPDATE_ME: {
      URL: '/users/me',
      METHOD: 'PATCH',
    },
  },
} as const;
