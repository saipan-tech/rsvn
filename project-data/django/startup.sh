
if [ ! -d "rsvn" ] ;then
/usr/local/bin/python /usr/local/bin/django-admin  startproject rsvn

cd rsvn
./manage.py startapp webapi
cd ..
fi

cd rsvn
./manage.py makemigrations --noinput
./manage.py  migrate
./manage.py runserver 0.0.0.0:9000



#cd /usr/src/app/django
#uwsgi --ini   uwsgi.ini 
