import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3011;
const DB_PATH = path.join(__dirname, 'data', 'database.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure DB exists
async function ensureDb() {
  await fs.ensureDir(path.join(__dirname, 'data'));
  if (!(await fs.pathExists(DB_PATH))) {
    await fs.writeJson(DB_PATH, {
      products: [],
      orders: [],
      customers: [],
      metadata: { lastUpdate: new Date().toISOString(), version: "1.0" }
    });
  }
}

// Routes
app.get('/api/db', async (req, res) => {
  const db = await fs.readJson(DB_PATH);
  res.json(db);
});

app.post('/api/save', async (req, res) => {
  const { products, orders, customers } = req.body;
  const currentDb = await fs.readJson(DB_PATH);
  
  const newDb = {
    products: products || currentDb.products,
    orders: orders || currentDb.orders,
    customers: customers || currentDb.customers,
    metadata: { lastUpdate: new Date().toISOString(), version: "1.0" }
  };

  await fs.writeJson(DB_PATH, newDb, { spaces: 2 });
  res.json({ success: true });
});

ensureDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 DB Server running at http://localhost:${PORT}`);
  });
});
