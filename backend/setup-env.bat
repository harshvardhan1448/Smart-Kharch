@echo off
echo ========================================
echo Smart Kharch - .env File Setup Helper
echo ========================================
echo.
echo Your .env file should contain:
echo.
echo MONGO_URI=mongodb://localhost:27017/smart_kharch
echo JWT_SECRET=my_super_secret_jwt_key_change_this_in_production_12345
echo PORT=8000
echo CLIENT_URL=http://localhost:5173
echo.
echo ========================================
echo.
echo Please open backend\.env file and make sure it has the above content.
echo.
echo After saving the .env file:
echo 1. Your backend will automatically restart
echo 2. You should see "MongoDB connected successfully"
echo 3. Your app will be ready at http://localhost:5173/
echo.
pause
