const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "school_db"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
app.get("/users/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(results[0]);
    });
});
app.post("/users", (req, res) => {
    const { name, email } = req.body;

    // Validation
    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }

    db.query(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [name, email],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({ message: "User created", id: result.insertId });
        }
    );
});
app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }

    db.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({ message: "User updated" });
        }
    );
});
app.delete("/users/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted" });
    });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});