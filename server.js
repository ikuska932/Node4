const express = require('express');
const { nanoid } = require('nanoid');
const db = require('./database');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/create', (req, res) => {
    const { url: originalUrl } = req.query;
    if (!originalUrl) {
        return res.status(400).json({ error: 'URL не указан' });
    }

    const shortId = nanoid(8);

    db.run(
        `INSERT INTO urls (id, original_url) VALUES (?, ?)`,
        [shortId, originalUrl],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка сохранения в базе данных' });
            }
            
            const shortUrl = `http://localhost:${PORT}/${shortId}`;
            res.json({ shortUrl });
        }
    );
});


app.get('/:id', (req, res) => {
    const { id } = req.params;

    
    db.get(
        `SELECT original_url FROM urls WHERE id = ?`,
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка базы данных' });
            }
            if (row) {
                res.redirect(row.original_url);
            } else {
                res.status(404).json({ error: 'URL не найден' });
            }
        }
    );
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
