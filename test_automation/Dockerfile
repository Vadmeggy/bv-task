FROM zenika/alpine-chrome:77-with-node
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true


COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app
WORKDIR /usr/src/app



#CMD ["node","my_script.js"]