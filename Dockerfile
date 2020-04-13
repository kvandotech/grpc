FROM node:13.12.0-alpine3.10 as react_build
WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn
RUN npm install -g serve
COPY . /app/
RUN yarn build
CMD ["serve", "-s", "build"]

FROM nginx:1.16.0-alpine

COPY --from=react_build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

#fire up nginx
EXPOSE 80 
CMD ["nginx","-g","daemon off;"]