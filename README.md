# discord-dedupoor

Calls out messages that have already been posted!

## How to run

`npm run start`

## Discord

Add bot to server: https://discord.com/api/oauth2/authorize?client_id=929935746167615508&permissions=117760&scope=bot

## Prisma

https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgres
`npx prisma init`

Migrate and apply
`npx prisma migrate dev --name replaced_name_with_username`
Only generate migration and apply separately
`npx prisma migrate dev --create-only`
`npx prisma migrate deploy`

In prod
`npx prisma migrate deploy`

Whenever you make changes to your Prisma schema in the future, you manually need to invoke `npx prisma generate` in order to accommodate the changes in your Prisma Client API.

This reads your Prisma schema and generates a version of Prisma Client that is tailored to your models :O

## Run tests

`npm run tests`