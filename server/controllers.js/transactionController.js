import db from "../db.js";

export const createTransfer = async (req, res) => {
  const client = await db.connect();


  try {
    const userId = req.user.userId;
    const { from_bucket_id, to_bucket_id, amount } = req.body;


    if (amount <= 0) return res.status(400).json({ error: "Amount must be positive" });

    if (String(from_bucket_id).trim() === String(to_bucket_id).trim()) {
  return res.status(400).json({ error: "Cannot transfer to same bucket" });
}

    await client.query("BEGIN");

    
    const bucketsRes = await client.query(
      "SELECT id, balance, is_main FROM buckets WHERE id = ANY($1::uuid[]) AND user_id = $2 FOR UPDATE",
      [[from_bucket_id, to_bucket_id], userId]
    );

    if (bucketsRes.rows.length !== 2) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "One or both buckets not found" });
    }

    
    const fromBucket = bucketsRes.rows.find(
      b => String(b.id) === String(from_bucket_id)
    );

    const toBucket = bucketsRes.rows.find(
      b => String(b.id) === String(to_bucket_id)
    );
    if (!fromBucket || !toBucket) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Invalid bucket selection" });
    }

    if (fromBucket.balance < amount) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Insufficient balance in source bucket" });
    }

    let transaction_type;
    if (fromBucket.is_main && !toBucket.is_main) transaction_type = "main_to_bucket";
    else if (!fromBucket.is_main && toBucket.is_main) transaction_type = "bucket_to_main";
    else transaction_type = "bucket_to_bucket";

    
    await client.query(
      "UPDATE buckets SET balance = balance - $1 WHERE id = $2",
      [amount, from_bucket_id]
    );
    await client.query(
      "UPDATE buckets SET balance = balance + $1 WHERE id = $2",
      [amount, to_bucket_id]
    );

    
    const txnRes = await client.query(
      `INSERT INTO transactions
        (user_id, from_bucket_id, to_bucket_id, amount, transaction_type, status)
       VALUES ($1, $2, $3, $4, $5, 'success') RETURNING *`,
      [userId, from_bucket_id, to_bucket_id, amount, transaction_type]
    );

    await client.query("COMMIT");

    res.status(201).json(txnRes.rows[0]);

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  } finally {
    client.release();
  }
};




export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
console.log("USER ID:", userId); 
    // pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    
    const result = await db.query(
      `SELECT * FROM transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countRes = await db.query(
      `SELECT COUNT(*) FROM transactions WHERE user_id = $1`,
      [userId]
    );

    const total = parseInt(countRes.rows[0].count);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};