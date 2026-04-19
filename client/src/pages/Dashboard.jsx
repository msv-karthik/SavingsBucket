import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { getDashboard } from "../api/dashboardApi.js";
import PCard from "../components/PCard.jsx";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard();
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

      {!data ? (
        <p>Loading...</p>
      ) : (
        <>
          
          <div className="flex-wrap">
            <Card>
              <h4>Main Balance</h4>
              <p>₹ {data.main_balance}</p>
            </Card>

            <Card>
              <h4>Bucket Savings</h4>
              <p>₹ {data.total_in_buckets}</p>
            </Card>

            <Card>
              <h4>Total Balance</h4>
              <p>₹ {data.total_balance}</p>
            </Card>
          </div>


          <h3 style={{ marginTop: "30px" }}>Your Goals</h3>

          {data.buckets?.map((bucket) => {
            const progress =
              bucket.goal_amount > 0
                ? Math.min(
                    (bucket.balance / bucket.goal_amount) * 100,
                    100
                  )
                : 0;

            return (
        
              <PCard key={bucket.id}>
              <div className="pcard-header">
                <h4>{bucket.name}</h4>
                <span className="pcard-percent">{progress.toFixed(0)}%</span>
              </div>

              <p className="pcard-amount">
                ₹ {bucket.balance} <span>/ ₹ {bucket.goal_amount}</span>
              </p>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </PCard>

            );
          })}
        </>
      )}
    </div>
  );
}

export default Dashboard;