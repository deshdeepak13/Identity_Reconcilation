# Identity Reconciliation

This project implements a backend service to link and reconcile customer identities across multiple purchases or interactions using email and phone numbers, paired with a React frontend that visualises the data.

## 🚀 Quick Setup

### 1. Database Setup

You will need a PostgreSQL database. Ensure you have the connection string ready.

### 2. Backend (Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add your PostgreSQL database URL:
   ```env
   DATABASE_URL=postgres://user:password@hostname:5432/dbname
   PORT=3000
   ```
4. Start node seed.js to seed the database:
   ```bash
   node seed.js
   ```
5. Start the server (runs on port 3000 by default):
   ```bash
   node index.js
   ```

### 3. Frontend (Client)

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory and add your backend URL:
   ```env
   VITE_API_URL=http://localhost:3000 or your backend url
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🧠 My Approach: Persistent Disjoint Set Union (DSU)

The core challenge of Identity Reconciliation is treating contacts as nodes in a graph, with phone numbers and emails acting as edges. We need to find the entire connected cluster of a user's identities.

While a classic Breadth-First Search (BFS) graph expansion works, it relies on iteratively querying the database over and over to find deeper, transitive relationships (e.g., A → B → C → D). This is an **O(K)** operation per request, which creates a massive network bottleneck.

Instead, I implemented a **Persistent Disjoint Set Union (DSU)** approach directly mapped to the database.

### 1. Mapping DSU to the Database

Traditional DSU uses in-memory arrays like `parent[]`. Here, the database is our source of truth:

- `linkedId` acts as the parent pointer.
- **Primary Contact** = Root of the tree (`linkedId` is `null`).
- **Secondary Contact** = Child node (`linkedId` points to the Root).

### 2. Union Operation (Combining Clusters)

When a new payload links two previously separate clusters:

1. We find the ultimate roots of both matched nodes.
2. We compare their `createdAt` timestamps. The **older** root remains the Primary (Union by Oldest).
3. The newer root's (and its children's) `linkedId` is aggressively updated to point to the older root.

### 3. Path Compression (Crucial for Speed)

During the `findRoot()` traversal, we track the entire upward path. Once the global root is found, we proactively update the `linkedId` of all visited intermediate nodes to point **directly** to the ultimate root.

- This ensures the database tree collapses to a depth of **1**.
- It completely eliminates long-term nested queries!

### 4. Constructing the Final Payload

Because of Path Compression, fetching an entire cluster is incredibly efficient. We simply run a **single database query**:

```sql
WHERE id = root.id OR linkedId = root.id
```

We no longer need BFS recursive queries. The DB traversal happens simultaneously with cluster gathering in **Amortized O(1)** database queries.

### 5. Important Additional Optimizations

- **Handling Race Conditions:** In a highly concurrent system, two identical requests firing simultaneously could duplicate a Primary contact. I mitigated this by wrapping the entire resolution flow inside a **Database Transaction** combined with row-level locking (`transaction.LOCK.UPDATE`).
- **Eliminated Sorting Overhead:** Rather than fetching all nodes, sorting them in memory by date, and picking the oldest, the DSU strictly executes "Union by Oldest" at merge time. The ultimate root is inherently guaranteed to be the oldest, bypassing heavy array sorting operations!
- **Future Scaling:** The architecture is perfectly suited for B-Tree indexing on `email`, `phoneNumber`, and `linkedId`, converting global table scans to lighting fast **O(log N)** lookups.

---

## 🛠️ Tech Stack

### Frontend (Client)

- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend (Server)

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Sequelize
- **Database:** PostgreSQL
