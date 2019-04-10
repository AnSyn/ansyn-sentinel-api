FROM node

WORKDIR Sentinel

COPY . .

RUN npm install

EXPOSE 10846

CMD ["node" , "index"]

