# FROM node:20-alpine3.17 as build-venv
# COPY package.json yarn.lock ./
# RUN yarn


# FROM node:20-alpine3.17 as build
# COPY --from=build-venv /node_modules /node_modules
# ENV PATH /node_modules/.bin:$PATH
# COPY . /app/service-frontend
# WORKDIR /app/service-frontend
# # ENTRYPOINT ["yarn", "dev","--host"]
# RUN yarn build


FROM nginx:1.21.1-alpine as production
# COPY --from=build /app/service-frontend/dist /usr/share/nginx/html
COPY nginx/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/certs/learnway.me.pem /usr/local/ssl/certificate/learnway.me.pem
COPY nginx/certs/learnway.me.key /usr/local/ssl/certificate/learnway.me.key

WORKDIR /usr/share/nginx/html
ENTRYPOINT ["nginx", "-g", "daemon off;"]
