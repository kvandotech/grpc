FROM node:13.12.0-alpine3.10
WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
EXPOSE 5000
ENV PATH /app/node_modules/.bin:$PATH
RUN yarn
RUN npm install -g serve
COPY . /app/
RUN yarn build

CMD ["serve", "-s", "build"]