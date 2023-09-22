import expressSession from 'express-session';

declare module 'express-session' {
  interface SessionData {
    otp?: string;
    otp_expire?: Date;
  }
}

declare module 'express' {
  interface Request {
    session: expressSession.Session & {
      otp?: string;
      otp_expire?: Date;
    };
  }
}
