import {PrismaClient} from "../../node_modules/.pnpm/@prisma+client@6.15.0_typescript@5.9.2/node_modules/@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma