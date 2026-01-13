# MongoDB Local Installation Guide for Windows

## 📥 Step 1: Download MongoDB

**Direct Download Link:**
https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-8.2.3-signed.msi

**Version:** MongoDB 8.2.3 Community Edition
**Size:** ~400 MB

Click the link above to download the MSI installer.

---

## 🔧 Step 2: Install MongoDB

1. **Run the downloaded MSI file** (mongodb-windows-x86_64-8.2.3-signed.msi)

2. **Setup Type:**
   - Choose **"Complete"** installation
   - Click **Next**

3. **Service Configuration:**
   - ✅ Check **"Install MongoDB as a Service"**
   - Service Name: `MongoDB`
   - Data Directory: `C:\Program Files\MongoDB\Server\8.2\data\`
   - Log Directory: `C:\Program Files\MongoDB\Server\8.2\log\`
   - ✅ Check **"Run service as Network Service user"**
   - Click **Next**

4. **MongoDB Compass:**
   - ✅ Check **"Install MongoDB Compass"** (optional but recommended - it's a GUI tool)
   - Click **Next**

5. **Install:**
   - Click **Install**
   - Wait for installation to complete (3-5 minutes)
   - Click **Finish**

---

## ✅ Step 3: Verify MongoDB is Running

### Option A: Using Services (Windows)
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Look for **"MongoDB"** in the list
4. Status should be **"Running"**

### Option B: Using Command Line
Open PowerShell and run:
```powershell
Get-Service MongoDB
```

You should see:
```
Status   Name               DisplayName
------   ----               -----------
Running  MongoDB            MongoDB
```

---

## 🔍 Step 4: Test MongoDB Connection

Open PowerShell and run:
```powershell
mongosh
```

You should see something like:
```
Current Mongosh Log ID: xxxxx
Connecting to: mongodb://127.0.0.1:27017/
Using MongoDB: 8.2.3
Using Mongosh: 2.x.x

test>
```

Type `exit` to quit the MongoDB shell.

---

## 🛠️ Troubleshooting

### If MongoDB service is not running:

**Start MongoDB Service:**
```powershell
net start MongoDB
```

**Check MongoDB Status:**
```powershell
Get-Service MongoDB
```

### If mongosh command not found:

Add MongoDB to your PATH:
1. Press `Win + X` and select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find and select "Path"
5. Click "Edit"
6. Click "New"
7. Add: `C:\Program Files\MongoDB\Server\8.2\bin`
8. Click OK on all windows
9. **Restart PowerShell**

---

## 🎯 Step 5: Update Your .env File

Once MongoDB is installed and running, update your backend `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/smart_kharch
JWT_SECRET=my_super_secret_jwt_key_12345
PORT=8000
CLIENT_URL=http://localhost:5173
```

**Save the file** and your backend will automatically restart!

---

## ✨ Expected Result

After updating `.env`, check your backend terminal. You should see:

```
✅ MongoDB connected successfully
✅ Server is running on port 8000
```

---

## 🎉 You're Done!

Your Smart Kharch app is now fully functional with local MongoDB!

Open http://localhost:5173/ and start tracking your expenses!
