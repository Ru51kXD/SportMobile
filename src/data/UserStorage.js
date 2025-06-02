import AsyncStorage from '@react-native-async-storage/async-storage';

const users = {
  'admin@sport.kz': {
    password: 'admin123',
    data: {
      bookings: [],
      favorites: [],
      bonus: 0,
      bonusHistory: [],
      profile: {
        name: 'Admin',
        email: 'admin@sport.kz',
        level: '',
        points: 0,
        role: 'admin',
      },
    },
  },
};
let currentUser = null;

const defaultUserData = (email = '', isAdmin = false) => ({
  bookings: [],
  favorites: [],
  bonus: 0,
  bonusHistory: [],
  profile: {
    name: '',
    email,
    level: '', // Без статуса
    points: 0,
    role: isAdmin ? 'admin' : 'user',
  },
});

const UserStorage = {
  async register(email, password) {
    if (users[email]) return false;
    const isAdmin = email === 'admin@sport.kz';
    users[email] = {
      password,
      data: defaultUserData(email, isAdmin),
    };
    currentUser = email;
    await AsyncStorage.setItem('userEmail', email);
    return true;
  },
  async login(email, password) {
    if (!users[email] || users[email].password !== password) return false;
    currentUser = email;
    await AsyncStorage.setItem('userEmail', email);
    return true;
  },
  async logout() {
    currentUser = null;
    await AsyncStorage.removeItem('userEmail');
  },
  getCurrentUser() {
    return currentUser;
  },
  getUserData() {
    if (!currentUser) return null;
    return users[currentUser].data;
  },
  setUserData(data) {
    if (!currentUser) return;
    users[currentUser].data = data;
  },
  isRegistered(email) {
    return !!users[email];
  },
  isAdmin() {
    if (!currentUser) return false;
    return users[currentUser].data.profile.role === 'admin';
  },
  async loadFromStorage() {
    const email = await AsyncStorage.getItem('userEmail');
    if (email && users[email]) {
      currentUser = email;
      return true;
    }
    return false;
  },
  async clearStorage() {
    await AsyncStorage.removeItem('userEmail');
    currentUser = null;
  }
};

export default UserStorage; 