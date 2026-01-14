// Admin Sidebar Items
export const ADMIN_SIDEBAR_ITEMS = [
  { 
    name: 'Dashboard', 
    icon: 'fa-chart-line', 
    route: '/admin' 
  },
  { 
    name: 'Exams', 
    icon: 'fa-book', 
    route: '/admin/exam' 
  },
  { 
    name: 'Questions', 
    icon: 'fa-question-circle', 
    route: '/admin/question' 
  },
  { 
    name: 'Users', 
    icon: 'fa-users', 
    route: '/admin/user' 
  },
];

// Admin Profile Items (footer)
export const ADMIN_PROFILE_ITEMS = [
  { 
    name: 'Profile', 
    icon: 'fa-user-circle', 
    route: '/profile' 
  },
  { 
    name: 'Change Password', 
    icon: 'fa-lock', 
    route: '/profile/change-password' 
  },
];

// User Sidebar Items
export const USER_SIDEBAR_ITEMS = [
  { 
    name: 'Home', 
    icon: 'fa-home', 
    route: '/',
    exact: true
  },
  { 
    name: 'Exams', 
    icon: 'fa-book', 
    route: '/exam',
    exact: true
  },
  { 
    name: 'History', 
    icon: 'fa-history', 
    route: '/exam/history',
    exact: true
  },
];

// User Profile Items (footer)
export const USER_PROFILE_ITEMS = [
  { 
    name: 'Profile', 
    icon: 'fa-user-circle', 
    route: '/profile',
    exact: true
  },
  { 
    name: 'Change Password', 
    icon: 'fa-lock', 
    route: '/profile/change-password',
    exact: true
  },
];

// Profile Sidebar Items
export const PROFILE_SIDEBAR_ITEMS = [
  { 
    name: 'Profile', 
    icon: 'fa-user-circle', 
    route: '/profile',
    exact: true
  },
  { 
    name: 'Change Password', 
    icon: 'fa-lock', 
    route: '/profile/change-password',
    exact: true
  },
];
