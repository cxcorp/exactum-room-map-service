FROM node:10-alpine as app
WORKDIR /usr/src/build

# node canvas lib does not have prebuild binaries for alpine (musl),
# so we need to compile it ourselves
RUN apk add --no-cache \
    --virtual .build-canvas \
    make gcc g++ python pkgconfig \
    pixman-dev cairo-dev pango-dev \
    libjpeg-turbo-dev giflib-dev
COPY package.json yarn.lock /usr/src/build/
RUN yarn

# use multi-stage build to copy built node_modules over but leave
# build tools behind (saves us ~200 MB)
FROM node:10-alpine
WORKDIR /app

# install libs needed by canvas to work with images
RUN apk add --no-cache cairo-dev pixman-dev giflib-dev libjpeg-turbo-dev pango-dev
COPY --from=0 /usr/src/build/node_modules ./node_modules
COPY . .

EXPOSE 6755
CMD ["node_modules/.bin/ts-node", "src/index.ts"]