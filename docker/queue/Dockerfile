FROM node:14.17.5-alpine
WORKDIR /usr/app
COPY . .
RUN yarn
EXPOSE 3333
CMD ["yarn", "run:queue"]
