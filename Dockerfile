# boron is version 6
FROM node:boron

# create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/

# install dependencies
COPY package.json /usr/src/
RUN npm install

# Bundle app source
COPY app /usr/src/app

EXPOSE 8080
CMD ["npm", "run", "start"]
