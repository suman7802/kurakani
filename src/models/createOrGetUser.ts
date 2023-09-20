const {prisma} = require('./db.js');

interface UserProfile {
  social_id: string;
  user_name: string;
  email: string;
  provider: string;
  otp: number;
  otp_expiration: Date;
}

async function getOrCreateUser(userProfile: UserProfile) {
  const migrate_date = new Date();
  try {
    // returning existing social user
    const result = await prisma.Users.findOne({
      social_id: userProfile.social_id,
      provider: userProfile.provider,
    });

    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      // migrate if manual user is matched with social
      const result = await db.query(
        "SELECT * FROM users WHERE email = $1 AND provider = 'manual'",
        [email]
      );
      if (result.rows.length) {
        const insertResult = await db.query(
          'UPDATE users SET social_id = $1, user_name = $2, provider = $3, otp = $4, otp_expiration = $5, migrate_date = $6 WHERE email = $7 RETURNING *',
          [
            social_id,
            user_name,
            provider,
            otp,
            otp_expiration,
            migrate_date,
            email,
          ]
        );
        return insertResult.rows[0];
      }
      // creating new social user
      const insertResult = await db.query(
        'INSERT INTO users (social_id, user_name, email, provider,  otp, otp_expiration) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [social_id, user_name, email, provider, otp, otp_expiration]
      );
      return insertResult.rows[0];
    }
  } catch (error) {
    return error;
  }
}

export {getOrCreateUser};
