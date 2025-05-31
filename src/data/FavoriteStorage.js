// src/data/FavoriteStorage.js
export const favoriteStorage = {
  favorites: [],
  
  addFavorite(id) {
    if (!this.favorites.includes(id)) {
      this.favorites.push(id);
    }
  },
  
  removeFavorite(id) {
    this.favorites = this.favorites.filter(fav => fav !== id);
  },
  
  getFavorites() {
    return this.favorites;
  },
  
  isFavorite(id) {
    return this.favorites.includes(id);
  }
}; 