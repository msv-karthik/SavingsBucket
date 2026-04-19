import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { getTransactions } from "../api/transactionApi.js";
import Button from "../components/Button.jsx";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getTransactions(page, 5);

      const txs = Array.isArray(res.data.data) ? res.data.data : [];
      setTransactions(txs);

      
      setTotalPages(res.data.totalPages || 1);

    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  
  const handlePrev = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setPage((prev) =>
      totalPages ? (prev < totalPages ? prev + 1 : prev) : prev + 1
    );
  };

  return (
    <div>
      <div className="container">
        <h2>Transaction History</h2>

        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          transactions.map((tx) => (
            <Card key={tx.id}>
              <p><strong>Amount:</strong> ₹ {tx.amount}</p>
              <p><strong>Type:</strong> {tx.transaction_type}</p>
              <p><strong>Status:</strong> {tx.status}</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(tx.created_at).toLocaleString()}
              </p>
            </Card>
          ))
        )}

        
        <div className="pagination">
          <Button
            onClick={handlePrev}
            disabled={page === 1 || loading}
          >
            Prev
          </Button>

          <span className="page-info" style={{marginLeft:"5px", marginRight: "5px"}}>
            Page {page} {totalPages ? `of ${totalPages}` : ""}
          </span>

          <Button
            onClick={handleNext}
            disabled={loading || (totalPages && page >= totalPages)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Transactions;