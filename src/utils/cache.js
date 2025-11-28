
const cache = {
  get: (key) => {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      const { data, expiry } = JSON.parse(cachedData);
      if (expiry > new Date().getTime()) {
        return data;
      }
      localStorage.removeItem(key);
    }
    return null;
  },
  set: (key, data, ttl = 3600000) => {
    const expiry = new Date().getTime() + ttl;
    localStorage.setItem(key, JSON.stringify({ data, expiry }));
  },
  clear: () => {
    localStorage.clear();
  },
};

export default cache;
