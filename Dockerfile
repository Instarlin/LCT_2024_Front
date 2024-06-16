# Specify a base image
FROM node:20.5.1-alpine

WORKDIR '/app'

COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .

CMD ["yarn", "vite", "--host", "0.0.0.0"]