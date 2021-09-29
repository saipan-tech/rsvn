
if [ ! -d 'rsvn' ] ; then 
ng new rsvn --routing --defaults=true
fi

cd rsvn
npm install
ng add @angular/material --skip-confirmation
#ng build --prod --output-path /usr/src/app/django/survey/static/ang/main  --watch --output-hashing none

ng serve --host 0.0.0.0 --disable-host-check
