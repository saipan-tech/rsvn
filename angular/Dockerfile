FROM alpine

WORKDIR /usr/src/app/angular
RUN apk update  && \
	apk add npm mc  && \
	npm install -g @angular/cli && \
	npm install --save @ng-select/ng-select  && \
	apk add --no-cache tzdata	
 ENV TZ=America/Los_Angeles