Write-Host "Setting up Backend..."

Set-Location server

# Create venv if it doesn't exist
if (!(Test-Path "venv")) {
    python -m venv venv
}

# Activate venv
.\venv\Scripts\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip

# Install backend packages
pip install `
django `
djangorestframework `
djangorestframework-simplejwt `
django-cors-headers `
drf-spectacular `
Pillow

Write-Host "Running migrations..."
python manage.py migrate

Write-Host "Creating superuser..."
python manage.py createsuperuser

Write-Host "Starting Django server in new window..."
Start-Process powershell -ArgumentList "cd server; .\venv\Scripts\Activate.ps1; python manage.py runserver"

Set-Location ..

Write-Host "Setting up Frontend..."

Set-Location client\st_l

npm install
npm install react-router-dom lucide-react axios recharts
npm install -D tailwindcss postcss autoprefixer

Write-Host "Starting React dev server in new window..."
Start-Process powershell -ArgumentList "cd client\st_l; npm run dev"
