import "dotenv/config";

export default {
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
