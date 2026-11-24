# Database Setup Guide – MongoDB Atlas

GameArena uses **MongoDB Atlas** (a free, cloud-hosted MongoDB) through
**Mongoose** for schema modeling. Follow these steps to set it up.

## 1. Create a Free Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register and sign up (free tier available).
2. Create a new **Project**, e.g. `GameArena`.

## 2. Create a Cluster
1. Click **Build a Database** → choose the **Free (M0)** tier.
2. Pick any cloud provider/region close to you.
3. Name the cluster (e.g. `gamearena-cluster`) and click **Create**.

## 3. Create a Database User
1. In **Database Access**, click **Add New Database User**.
2. Choose a username and password (save these — you'll need them in the connection string).
3. Give the user **Read and write to any database** permission.

## 4. Allow Network Access
1. In **Network Access**, click **Add IP Address**.
2. For development, choose **Allow Access from Anywhere** (`0.0.0.0/0`).
   (For production, restrict this to your server's IP.)

## 5. Get the Connection String
1. Go to **Database** → click **Connect** on your cluster.
2. Choose **Drivers** → Node.js.
3. Copy the connection string, which looks like:
   ```
   mongodb+srv://<username>:<password>@gamearena-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your database user's credentials,
   and add a database name before the `?`, e.g.:
   ```
   mongodb+srv://myuser:mypassword@gamearena-cluster.xxxxx.mongodb.net/gamearena?retryWrites=true&w=majority
   ```

## 6. Add It to the Backend
1. In `backend/`, copy `.env.example` to `.env`.
2. Paste your connection string into `MONGO_URI`:
   ```
   MONGO_URI=mongodb+srv://myuser:mypassword@gamearena-cluster.xxxxx.mongodb.net/gamearena?retryWrites=true&w=majority
   ```
3. Set a random string for `JWT_SECRET` (any long unpredictable text works).
4. Save the file.

## 7. Verify the Connection
Run the backend:
```bash
cd backend
npm install
npm run dev
```
If the connection succeeds, you'll see in the terminal:
```
MongoDB Connected: gamearena-cluster-shard-00-00.xxxxx.mongodb.net
GameArena server running in development mode on port 5000
```

## 8. Collections Created Automatically
Mongoose creates collections automatically the first time a document is saved.
You do not need to manually create collections — as soon as you register a
user or create a tournament through the app, MongoDB Atlas will show these
collections under your `gamearena` database:

- `users`
- `tournaments`
- `registrations`
- `matches`
- `leaderboards`
- `results`

You can view/inspect this data anytime using **Atlas → Browse Collections**,
or with a local GUI tool like **MongoDB Compass** (also free) connected using
the same connection string.

## 9. (Optional) Seed Sample Data
For a quick demo, you can register:
- 1 Organizer account → create 1–2 tournaments
- 2–3 Player accounts → register for those tournaments
- Approve the registrations as the organizer
- Schedule a couple of matches and update their results
- Publish the tournament results

This gives you enough data to demo every module during a viva.
