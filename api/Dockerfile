FROM node:17
WORKDIR /app
VOLUME ["/app/prisma/data"]
COPY package.json .
COPY yarn.lock .
RUN yarn install
RUN chown -R node:staff ./node_modules
COPY . .
EXPOSE 3000
