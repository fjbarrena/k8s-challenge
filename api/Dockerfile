FROM node:lts-slim

ENV APP_PATH /opt/kyso/api
WORKDIR $APP_PATH

COPY package.json package-lock.json $APP_PATH/
RUN npm install
RUN npm install @nestjs/cli -g

# Install gcloud
RUN apt-get update -y && apt-get install gnupg gnupg2 gnupg1 curl -y
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add - && apt-get update -y && apt-get install google-cloud-sdk -y


COPY . $APP_PATH/

EXPOSE 3000

CMD ["nest", "start"]
