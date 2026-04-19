import { useEffect, useState } from "react";
import { getBuckets, createBucket, updateBucket } from "../api/bucketsApi.js";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

function Buckets() {
  const [buckets, setBuckets] = useState([]);
  const [newName, setNewName] = useState("");
  const [newGoal, setNewGoal] = useState("");

  const fetchBuckets = async () => {
    try {
      const res = await getBuckets();
      setBuckets(res.data);
    } catch (err) {
      console.error("Error fetching buckets:", err);
    }
  };

  useEffect(() => {
    fetchBuckets();
  }, []);

  
  const handleCreate = async () => {
    if (!newName.trim()) {
      alert("Bucket name is required");
      return;
    }

    if (!newGoal || Number(newGoal) < 0) {
      alert("Enter valid goal amount");
      return;
    }

    try {
      const res = await createBucket({
        name: newName,
        goal_amount: Number(newGoal),
      });

      setBuckets((prev) => [...prev, res.data]);
      setNewName("");
      setNewGoal("");
    } catch (err) {
      console.error("Error creating bucket:", err);
    }
  };

  
  const handleUpdate = async (id) => {
    const name = prompt("New name:");
    const goal = prompt("New goal amount:");

    if (!name || !name.trim()) {
      alert("Name is required");
      return;
    }

    if (!goal || Number(goal) < 0) {
      alert("Invalid goal amount");
      return;
    }

    try {
      const res = await updateBucket(id, {
        name,
        goal_amount: Number(goal),
      });

      setBuckets((prev) =>
        prev.map((b) => (b.id === id ? res.data : b))
      );
    } catch (err) {
      console.error("Error updating bucket:", err);
    }
  };

  return (
    <div className="container">
      <h2>Buckets</h2>

      
      <div style={{ marginBottom: "20px" }}>
        <Input
          placeholder="Bucket Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Goal Amount"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />

        <Button onClick={handleCreate}>Create Bucket</Button>
      </div>

      
      {buckets.map((bucket) => (
        <Card key={bucket.id}>
          <p><strong>Name:</strong> {bucket.name}</p>
          <p><strong>Goal:</strong> ₹ {bucket.goal_amount}</p>
          <p><strong>Main:</strong> {bucket.is_main ? "Yes" : "No"}</p>

          <Button onClick={() => handleUpdate(bucket.id)}>
            Edit
          </Button>
        </Card>
      ))}
    </div>
  );
}

export default Buckets;