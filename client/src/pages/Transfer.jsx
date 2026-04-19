import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBuckets, createTransfer } from "../api/transactionApi.js";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";

function Transfer() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [buckets, setBuckets] = useState([]);
  const [data, setData] = useState({ from: null, to: null, amount: "" });

  const [password, setPassword] = useState(""); 

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [count, setCount] = useState(5);
  const [verifying, setVerifying] = useState(false);

  
  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        setLoading(true);
        const res = await getBuckets();

        const mapped = res.data.map((b) => ({
          id: String(b.id),
          name: b.name,
          balance: Number(b.balance || b.current_amount || 0),
        }));

        setBuckets(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuckets();
  }, []);


useEffect(() => {
  if (!success) return;

  const timer = setInterval(() => {
    setCount((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [success]);


useEffect(() => {
  if (count === 0 && success) {
    navigate("/transactions");
  }
}, [count, success, navigate]);


  const selectFromBucket = (id) => {
    const selected = buckets.find((b) => b.id === id);
    setData({ from: selected, to: null, amount: "" });
    setStep(2);
  };

  const selectToBucket = (id) => {
    const selected = buckets.find((b) => b.id === id);
    setData((prev) => ({ ...prev, to: selected }));
    setStep(3);
  };

  const handleContinue = () => {
    if (!data.amount || Number(data.amount) <= 0) {
      return alert("Enter valid amount");
    }

    if (data.from.id === data.to.id) {
      return alert("Cannot transfer to same bucket");
    }

    setStep(4);
  };

  const handleVerifyAndTransfer = async () => {
    if (!password) return alert("Enter password");

    const token = localStorage.getItem("token");

    try {
      setVerifying(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify({ password }),
        }
      );

      const dataRes = await res.json();

      if (!res.ok || !dataRes.valid) {
        setVerifying(false);
        return alert(dataRes.error || "Invalid password");
      }

      
      await createTransfer({
        from_bucket_id: data.from.id,
        to_bucket_id: data.to.id,
        amount: Number(data.amount),
      });

      setSuccess(true);
      setStep(5);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setVerifying(false);
    }
  };

  const renderStep = () => {
    if (loading) return <p>Loading buckets...</p>;

    switch (step) {
      case 1:
        return (
          <>
            <h2>Select Source Bucket</h2>
            {buckets.map((b) => (
              <div
                key={b.id}
                className={`option ${data.from?.id === b.id ? "selected" : ""}`}
                onClick={() => selectFromBucket(b.id)}
              >
                {b.name} — ₹{b.balance}
              </div>
            ))}
          </>
        );

      case 2:
        return (
          <>
            <h2>Select Destination Bucket</h2>
            {buckets
              .filter((b) => b.id !== data.from?.id)
              .map((b) => (
                <div
                  key={b.id}
                  className={`option ${data.to?.id === b.id ? "selected" : ""}`}
                  onClick={() => selectToBucket(b.id)}
                >
                  {b.name} — ₹{b.balance}
                </div>
              ))}
          </>
        );

      case 3:
        return (
          <>
            <h2>Enter Amount</h2>

            <Input
              type="number"
              placeholder="₹ 5000"
              value={data.amount}
              onChange={(e) =>
                setData((prev) => ({ ...prev, amount: e.target.value }))
              }
            />

            <Button onClick={handleContinue}>Continue</Button>
          </>
        );

      case 4:
        return (
          <>
            <h2>Confirm Transfer</h2>

            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Enter your password to authorize this transaction
            </p>

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={handleVerifyAndTransfer} disabled={verifying}>
              {verifying ? "Verifying..." : "Confirm Transfer"}
            </Button>
          </>
        );

      case 5:
        return (
          <div style={{ textAlign: "center" }}>
            <h1>✅</h1>
            <h2>Transfer Successful</h2>
            <p>
              ₹{data.amount} from {data.from.name} → {data.to.name}
            </p>
            <p>Redirecting in {count} seconds...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container transfer-layout">
      <div className="content">{renderStep()}</div>

      <div className="summary">
        <h3>Summary</h3>
        <p><strong>From:</strong> {data.from?.name || "—"}</p>
        <p><strong>To:</strong> {data.to?.name || "—"}</p>
        <p><strong>Amount:</strong> {data.amount ? "₹" + data.amount : "—"}</p>
        <p>Status: {success ? "Completed" : "In Progress"}</p>
      </div>
    </div>
  );
}

export default Transfer;