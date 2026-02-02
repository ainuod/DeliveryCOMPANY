#!/bin/bash

echo "Setting up Backend..."

cd server || exit

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

source venv/bin/activate

pip install --upgrade pip

pip install django \
djangorestframework \
djangorestframework-simplejwt \
django-cors-headers \
drf-spectacular \
Pillow

echo "Running migrations..."
python manage.py migrate

echo "Creating superuser..."
python manage.py createsuperuser

echo "Starting Django server in background..."
python manage.py runserver &

cd ..

echo "Setting up Frontend..."

cd client/st_l || exit

npm install
npm install react-router-dom lucide-react axios recharts
npm install -D tailwindcss postcss autoprefixer

echo "Starting React dev server..."
npm run dev
