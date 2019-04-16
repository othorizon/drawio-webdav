FROM node:10.8.0-alpine

WORKDIR /app
ADD . /app/
EXPOSE 3000
RUN npm install
CMD ["npm", "start"]
