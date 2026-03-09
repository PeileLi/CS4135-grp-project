export const loginAPI = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        resolve({
          data: {
            user: {
              id: 1,
              fullName: "Demo Student",
              email: email,
              token: "mock-jwt-token"
            }
          }
        });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 800);
  });
};

export const registerAPI = (fullName, email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          user: {
            id: Date.now(),
            fullName: fullName,
            email: email,
            token: "mock-jwt-token"
          }
        }
      });
    }, 800);
  });
};