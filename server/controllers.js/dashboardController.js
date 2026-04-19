import db from "../db.js";


export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;


    const mainRes = await db.query(
      "SELECT balance FROM buckets WHERE user_id = $1 AND is_main = TRUE",
      [userId]
    );

    const main_balance = mainRes.rows[0]?.balance || 0;


    const bucketRes = await db.query(
      "SELECT COALESCE(SUM(balance), 0) AS total FROM buckets WHERE user_id = $1 AND is_main = FALSE",
      [userId]
    );

    
    const total_in_buckets = parseFloat(bucketRes.rows[0].total);

    
    const total_balance = parseFloat(main_balance) + total_in_buckets;

    
    const bucketsRes = await db.query(
      "SELECT id, name, goal_amount, balance FROM buckets WHERE user_id = $1 AND is_main = FALSE",
      [userId]
    );

    res.status(200).json({
      main_balance,
      total_in_buckets,
      total_balance,
      buckets: bucketsRes.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};