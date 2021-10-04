FROM node:lts-slim

ENV APP_PATH /opt/kyso/api
WORKDIR $APP_PATH

COPY package.json package-lock.json $APP_PATH/
RUN npm install
RUN npm install @nestjs/cli -g

COPY . $APP_PATH/

EXPOSE 3000

CMD ["nest", "start"]
