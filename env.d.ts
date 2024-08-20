declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    JWT_SECRET: string;
    JWT_COOKIE_EXPIRES_IN: string;
    JWT_EXPIRES_IN: string;
  }
}
