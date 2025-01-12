import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { DomainEvents } from "@/core/events/domain-events";

config({ path: ".env", override: true });
config({ path: ".env.test.local", override: true });

const prisma = new PrismaClient();
const schemaId = randomUUID();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL in .env file");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schemaId);

  return url;
}

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL.toString();

  DomainEvents.shouldRun = false;

  execSync("pnpm prisma migrate deploy");
});

afterAll(async () => {
  //await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
