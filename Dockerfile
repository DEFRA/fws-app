ARG PARENT_VERSION=2.10.0-node22.21.1

FROM defradigital/node:${PARENT_VERSION} AS base
ARG PORT=3000
ENV PORT=${PORT}

USER root

# set -xe : -e abort on error : -x verbose output
RUN set -xe \
  && apk update && apk upgrade \
  && rm -rf /var/cache/apk/* \
  && mkdir -p /home/node/app

# Create app directory
WORKDIR /home/node/app

# Copy the basic directories/files across
RUN mkdir -p dist
COPY --chown=node:node --chmod=644 package*.json .
COPY --chown=node:node --chmod=644 ./index.js .
COPY --chown=node:node --chmod=644 ./bin ./bin
COPY --chown=node:node --chmod=644 ./client ./client
COPY --chown=node:node --chmod=644 ./server ./server

ARG BUILD_VERSION=v4.0.0-1-g6666666
ARG GIT_COMMIT=0
RUN echo -e "module.exports = { version: '$BUILD_VERSION', revision: '$GIT_COMMIT' }" > ./version.js

FROM base AS development

# Temporarily disable the postinstall NPM script
RUN npm pkg set scripts.postinstall="echo no-postinstall" \
&& npm ci --ignore-scripts --omit dev \
&& npm run build

USER node
EXPOSE ${PORT}/tcp
EXPOSE 9229/tcp
CMD [ "node", "--inspect=0.0.0.0:9229", "index.js" ]

FROM base AS production 

# Temporarily disable the postinstall NPM script
RUN npm pkg set scripts.postinstall="echo no-postinstall" \
&& npm ci --ignore-scripts --omit dev \
&& npm run build

USER node
EXPOSE ${PORT}/tcp
CMD [ "node", "index.js" ]