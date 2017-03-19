FROM node:7.5.0
ENV PATH /usr/bin/:$PATH
WORKDIR /taskmicroservice
ADD package.json /taskmicroservice/package.json
RUN npm install --silent \
    && npm cache clean \
    && rm -rf npm*
ADD config.js /taskmicroservice/config.js
ADD index.js /taskmicroservice/index.js

EXPOSE 10003

CMD ["node", "index"]
