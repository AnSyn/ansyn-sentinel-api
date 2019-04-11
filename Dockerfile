FROM node

WORKDIR Sentinel

COPY . .

RUN npm install

CMD ["npm" , "start"]

