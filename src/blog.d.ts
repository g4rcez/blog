export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      TWITTER: string;
      TWITTER_ALT: string;
      GITHUB: string;
      SECRET_COOKIE: string;
      URL_CALLBACK: string;
    }
  }
}
