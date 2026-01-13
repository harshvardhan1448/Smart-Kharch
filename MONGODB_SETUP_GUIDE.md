# MongoDB Setup Guide for Smart Kharch

## 🎯 Quick Setup - Choose Your Option

You have **2 options** for MongoDB. I recommend **Option 1 (MongoDB Atlas)** if you're new to MongoDB.

---

## ✅ **Option 1: MongoDB Atlas (Cloud - RECOMMENDED)**

### Why Choose This?
- ✨ **Free forever** (512MB storage)
- 🚀 **No installation needed**
- 🌐 **Works from anywhere**
- 🔒 **Secure and managed**

### Step-by-Step Setup:

#### 1. Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email or Google account
3. Choose the **FREE** tier (M0 Sandbox)

#### 2. Create a Cluster
1. After signing in, click **"Build a Database"**
2. Choose **FREE** tier (M0)
3. Select a cloud provider (AWS recommended)
4. Choose a region close to you
5. Click **"Create Cluster"** (takes 3-5 minutes)

#### 3. Create Database User
1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `smartkharch` (or any name you like)
5. Password: Click **"Autogenerate Secure Password"** and **COPY IT**
6. User Privileges: Select **"Read and write to any database"**
7. Click **"Add User"**

#### 4. Whitelist Your IP Address
1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

#### 5. Get Your Connection String
1. Click **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` with your database username
6. Replace `<password>` with your database password
7. Add `/smart_kharch` before the `?` to specify database name

**Final connection string should look like:**
```
mongodb+srv://smartkharch:YourPassword123@cluster0.xxxxx.mongodb.net/smart_kharch?retryWrites=true&w=majority
```

#### 6. Update Your .env File
1. Open `backend/.env` file
2. Replace the `MONGO_URI` line with your connection string:
   ```env
   MONGO_URI=mongodb+srv://smartkharch:YourPassword123@cluster0.xxxxx.mongodb.net/smart_kharch?retryWrites=true&w=majority
   JWT_SECRET=my_super_secret_jwt_key_12345
   PORT=8000
   CLIENT_URL=http://localhost:5173
   ```
3. Save the file

#### 7. Restart Your Backend Server
The backend server will automatically restart (nodemon) and connect to MongoDB!

---

## 🖥️ **Option 2: Local MongoDB**

### Why Choose This?
- 🏠 **Runs on your computer**
- 🔌 **Works offline**
- ⚡ **Faster for development**

### Step-by-Step Setup:

#### 1. Install MongoDB
**Windows:**
1. Download: https://www.mongodb.com/try/download/community
2. Choose **Windows** and **MSI** installer
3. Run the installer
4. Choose **Complete** installation
5. Check **"Install MongoDB as a Service"**
6. Check **"Install MongoDB Compass"** (GUI tool)

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

#### 2. Start MongoDB Service

**Windows:**
MongoDB should start automatically as a service. If not:
```powershell
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 3. Verify MongoDB is Running
```bash
mongosh
```
If you see the MongoDB shell, it's working! Type `exit` to quit.

#### 4. Update Your .env File
```env
MONGO_URI=mongodb://localhost:27017/smart_kharch
JWT_SECRET=my_super_secret_jwt_key_12345
PORT=8000
CLIENT_URL=http://localhost:5173
```

#### 5. Restart Your Backend Server
The backend will connect to your local MongoDB!

---

## 🔍 Verify Connection

After setting up MongoDB, you should see in your backend terminal:
```
✅ MongoDB connected successfully
✅ Server is running on port 8000
```

If you see errors, check:
1. ✅ Connection string is correct
2. ✅ Username and password are correct
3. ✅ IP address is whitelisted (Atlas only)
4. ✅ MongoDB service is running (Local only)

---

## 🎉 Next Steps

Once MongoDB is connected:
1. Open http://localhost:5173/
2. Click **"Sign Up"** to create an account
3. Start adding income and expenses!

---

## 🆘 Troubleshooting

### "MongooseServerSelectionError"
- **Atlas**: Check your IP is whitelisted
- **Local**: Make sure MongoDB service is running

### "Authentication failed"
- Check username and password in connection string
- Make sure you replaced `<password>` with actual password

### "ECONNREFUSED"
- **Local**: MongoDB service is not running
- Start MongoDB service (see instructions above)

### Need Help?
Let me know which option you chose and any error messages you see!
