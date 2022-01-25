FROM alpine

WORKDIR /usr/src/app/angular2
RUN apk update  && \
	apk add npm mc  && \
	npm install -g @angular/cli && \
	apk add --no-cache tzdata	
 ENV TZ=America/Los_Angeles