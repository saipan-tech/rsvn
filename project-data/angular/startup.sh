if [ ! -d 'rsvn' ] ; then 
ng new rsvn --routing --defaults=true --style=scss
fi
cd rsvn
npm install
ng add @angular/material --skip-confirmation
ng add @angular/cdk  --skip-confirmation
npm install @ng-bootstrap/ng-bootstrap@10
npm install bootstrap

npm install @ngrx/store@12
npm install @ngrx/store-devtools@12
npm install @ngrx/data@12
npm install @ngrx/effects@12 
npm install @ngrx/router-store@12 
npm install @ngrx/entity@12
npm install echarts 
npm install ngx-echarts 

ng add @angular/localize --skip-confirmation
#ng build --prod --output-path /usr/src/app/django/survey/static/ang/main  --watch --output-hashing none

ng serve --host 0.0.0.0 --disable-host-check
