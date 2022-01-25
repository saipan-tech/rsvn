FROM nginx

WORKDIR /usr/src/app/nginx

COPY  rsvn.conf /etc/nginx/conf.d/
RUN rm /etc/nginx/conf.d/default.conf
ENV TZ=America/Los_Angeles
