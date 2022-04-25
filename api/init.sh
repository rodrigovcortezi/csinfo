#!/bin/bash
chown -R node:staff ./prisma/data
echo "Migrating database..."
npx prisma migrate deploy
echo "Generating database client..."
npx prisma generate
echo "Database ready!"

node index.js