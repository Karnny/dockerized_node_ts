FROM node:14

WORKDIR /server
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "build/index.js"]