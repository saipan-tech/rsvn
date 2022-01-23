if [ ! -d 'rsvn' ] ; then 
ng new rsvn --routing --defaults=true --style=scss
fi
cd rsvn
npm install
ng add @angular/material --skip-confirmation
ng add @angular/cdk  --skip-confirmation
npm install @ng-bootstrap/ng-bootstrap
npm install bootstrap

ng add @ngrx/store --skip-confirmation
ng add @ngrx/effects --skip-confirmation
ng add @ngrx/store-devtools --skip-confirmation
ng add @ngrx/router-store --skip-confirmation
ng add @ngrx/entity --skip-confirmation


ng add @angular/localize --skip-confirmation
#ng build --prod --output-path /usr/src/app/django/survey/static/ang/main  --watch --output-hashing none

ng serve --host 0.0.0.0 --disable-host-check
