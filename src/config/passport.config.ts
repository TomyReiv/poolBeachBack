import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  googleCallbackUrl,
  googleClientId,
  googleClientSecret,
} from "../utils/constant";
import { findOrCreateUser } from "../services/auth.service";

const GOOGLE_CLIENT_ID = googleClientId;
const GOOGLE_CLIENT_SECRET = googleClientSecret;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: googleCallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser(profile);
        return done(null, user);
      } catch (error) {
        console.error("Error during Google authentication:", error);
        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    done(null, { id });
  } catch (error) {
    done(error, undefined);
  }
  // O busca al usuario si necesitas más datos
});
