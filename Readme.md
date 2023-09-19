create tables

generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

model Users {
id Int @id @default(autoincrement())
social_id String?
user_naem String?
email String?
provider String
otp DateTime?
registered_date DateTime @default(now())
posts Posts[]
migrated_date DateTime?
}

model Posts {
id Int @id @default(autoincrement())
user Users @relation(fields: [user_id], references: [id])
user_id Int
title String @unique
blog String
private Boolean @default(false)
likes Int @default(0)
comments Comments[]
created_date DateTime @default(now())
edited_date DateTime?
}

model Comments {
id Int @id @default(autoincrement())
post Posts @relation(fields: [post_id], references: [id])
post_id Int
comment String
created_date DateTime @default(now())
replies Replies[]
edited_date DateTime?
}

model Replies {
id Int @id @default(autoincrement())
commnet Comments @relation(fields: [comment_id], references: [id])
comment_id Int
reply String
created_date DateTime @default(now())
edited_date DateTime?
}
