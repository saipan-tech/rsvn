if [ ! -d 'rsvn' ] ; then 
ng new rsvn --routing --defaults=true --style=scss
fi
cd rsvn
npm install
ng add @angular/material --skip-confirmation
ng add @angular/cdk  --skip-confirmation
npm install @ng-bootstrap/ng-bootstrap
npm install bootstrap

npm install @ngrx/store 
npm install @ngrx/store-devtools 
npm install @ngrx/data  
npm install @ngrx/effects 
npm install @ngrx/router-store 
npm install @ngrx/entity  

ng add @angular/localize --skip-confirmation
#ng build --prod --output-path /usr/src/app/django/survey/static/ang/main  --watch --output-hashing none

ng serve --host 0.0.0.0 --disable-host-check
