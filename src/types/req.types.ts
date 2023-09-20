import {Prisma} from '@prisma/client';

declare global {
  namespace Express {
    export interface User extends Prisma.UsersFieldRefs {}
  }
}
// export interface User {name: string}
