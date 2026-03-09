// src/services/restaurantService.js

// 模拟餐厅数据
const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: "Burger King",
    address: "123 Main St, New York",
    category: "burger",
    rating: 4.5,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80"
  },
  {
    id: 2,
    name: "Pizza Hut",
    address: "456 Broadway, New York",
    category: "pizza",
    rating: 4.2,
    deliveryTime: "30-45 min",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80"
  },
  {
    id: 3,
    name: "Sushi Master",
    address: "789 5th Ave, New York",
    category: "sushi",
    rating: 4.8,
    deliveryTime: "40-50 min",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80"
  },
  {
    id: 4,
    name: "Green Salad",
    address: "101 Park Ave, New York",
    category: "healthy",
    rating: 4.6,
    deliveryTime: "15-25 min",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80"
  }
];

// 模拟菜单数据
const MOCK_MENU = [
  { id: 101, name: "Signature Burger", description: "Beef patty with cheddar cheese", price: 12.99 },
  { id: 102, name: "Crispy Fries", description: "Golden salted fries", price: 4.99 },
  { id: 103, name: "Cola Zero", description: "Chilled soft drink", price: 2.50 },
  { id: 104, name: "Spicy Chicken", description: "Fried chicken with hot sauce", price: 10.99 },
  { id: 105, name: "Family Meal", description: "2 Burgers + 2 Fries + 2 Drinks", price: 28.99 },
];

// 模拟 API 延迟和结构
export const getRestaurants = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: MOCK_RESTAURANTS });
    }, 500);
  });
};

export const getRestaurantById = (id) => {
  return new Promise((resolve) => {
    const restaurant = MOCK_RESTAURANTS.find(r => r.id === parseInt(id));
    setTimeout(() => {
      resolve({ data: restaurant || MOCK_RESTAURANTS[0] });
    }, 500);
  });
};

export const getMenuByRestaurantId = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: MOCK_MENU });
    }, 500);
  });
};