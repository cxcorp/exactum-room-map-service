FROM node:10-slim
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn

EXPOSE 6755

COPY . .

ARG sentry_release=dev
ENV SENTRY_RELEASE=${sentry_release}

CMD ["node_modules/.bin/ts-node", "src/index.ts"]