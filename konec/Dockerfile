# Dockerfile for frontend

FROM node:18 AS build

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install


# Build the React app
RUN npm run build

FROM nginx:alpine


COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
