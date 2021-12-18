
if [ ! -d 'rsvnterm' ] ; then 
ng new rsvnterm --routing --defaults=true --style=scss
fi

cd rsvnterm
npm install
ng add @angular/material --skip-confirmation
ng add @angular/cdk  --skip-confirmation
npm install @ng-bootstrap/ng-bootstrap
npm install bootstrap
ng add @angular/localize --skip-confirmation


#ng build --prod --output-path /usr/src/app/django/survey/static/ang/main  --watch --output-hashing none

ng serve --host 0.0.0.0 --disable-host-check
