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
    CREATE_POST: {
      URL: '/posts',
      METHOD: 'POST',
    },
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
    GET_CALENDAR: {
      URL: '/posts/calendar',
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
    SUBMIT: {
      URL: (missionId: number) => `/missions/${missionId}/submissions`,
      METHOD: 'POST',
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
