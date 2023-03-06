
if [ ! -d 'rsvnterm' ] ; then
ng new rsvnterm --routing --defaults=true --style=scss
fi

cd rsvnterm
npm install
ng serve --host 0.0.0.0 --disable-host-check
