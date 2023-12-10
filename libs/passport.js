const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./prisma');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await prisma.users.upsert({
          where: {
            email: profile.emails[0].value,
          },
          update: { googleId: profile.id, profile: { update: { profile_picture: profile.photos[0].value } } },
          create: {
            nickname: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            isVerified: profile.emails[0].verified,
            profile: {
              create: {
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                profile_picture: profile.photos[0].value,
              },
            },
          },
        });

        delete user.password;

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
