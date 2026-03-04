ARG PARENT_VERSION=2.10.3-node22.21.1

FROM defradigital/node:${PARENT_VERSION} AS base
ARG PORT=3000
ENV PORT=${PORT}

USER root

# set -xe : -e abort on error : -x verbose output
RUN set -xe \
  && apk update && apk upgrade \
  && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /home/node/app

# Copy the basic directories/files across
# When developing/debugging within a container locally, --chown=root:root should be replaced with --chown=node:node to provide
# required write permissions. SonarQube cloud will raise a security issue if analysing these changes.
RUN mkdir -p dist
COPY --chown=root:root package*.json .
COPY --chown=root:root ./index.js .
COPY --chown=root:root ./bin ./bin
COPY --chown=root:root ./client ./client
COPY --chown=root:root ./server ./server

ARG BUILD_VERSION=v4.0.0-1-g6666666
ARG GIT_COMMIT=0
RUN echo -e "module.exports = { version: '$BUILD_VERSION', revision: '$GIT_COMMIT' }" > ./version.js

FROM base AS development

# When developing/debugging within a container locally, --chown=root:root should be replaced with --chown=node:node to provide
# required write permissions. SonarQube cloud will raise a security issue if analysing these changes.
COPY --chown=root:root ./test ./test

# Temporarily disable the postinstall NPM script
RUN npm pkg set scripts.postinstall="echo no-postinstall" \
&& npm ci --ignore-scripts --include dev \
&& npm run build

USER node
EXPOSE ${PORT}/tcp
EXPOSE 9229/tcp
CMD [ "node", "--inspect=0.0.0.0:9229", "index.js" ]

FROM base AS production 

# Temporarily disable the postinstall NPM script
RUN npm pkg set scripts.postinstall="echo no-postinstall" \
&& npm ci --ignore-scripts --omit dev \
&& npm run build && chmod -R a-w /home/node

USER node
EXPOSE ${PORT}/tcp
CMD [ "node", "index.js" ]