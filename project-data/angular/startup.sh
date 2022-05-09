if [ ! -d 'rsvn' ] ; then 
ng new rsvn --routing --defaults=true --style=scss
fi
cd rsvn
npm install
ng serve --host 0.0.0.0 --disable-host-check
