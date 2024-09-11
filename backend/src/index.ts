// src/index.ts
import express, { query, Request, Response } from 'express';
import pool, { VerificaConnesione } from './databasepg/db'; // Importa pool e la funzione di verifica
const app = express();
const port = 3000;

app.use(express.json());



VerificaConnesione();

app.get('/users', async (req: Request, res: Response) => {

try {
    const risultato = await pool.query('SELECT * FROM users');
    res.json(risultato.rows);
} catch (err) {
    console.error(err);
    res.status(500).json({error: 'Abbiamo un problema nel ricupero di tutti gi utenti (rivedi il codice)'});
} 
});


app.post('/users', async (req: Request, res: Response) => {
  const {name, email, age} = req.body; 
  const userId = parseInt(req.params.id);

  if(!name || typeof name !== 'string'){
    return res.status(400).json({error: 'il campo nome è obbligatorio e deve essere una stringa è non può essere vuoto'});
  } 

  if(!email || typeof email !== 'string'){
    return res.status(400).json({error: 'il campo email è obbligatorio è non deve essere vuoto'});
  }

  if(!age || typeof age !== 'number' || age <= 0){
    return res.status(400).json({error: 'il campo anni è obbligatorio è non deve essere vuoto deve essere anche maggiore di 0'});
  }

    try {
        const risultato = await pool.query('INSERT INTO users (name,email,age) VALUES ($1,$2,$3) RETURNING *',
        [name, email, age] 
     );
        res.json(risultato.rows[0]);
       
    } catch(err){
        console.error(err);
        res.status(500).json({error: 'Abbiamo un problema non riusciamo ad aggingere un utente nuovo (sistema il codice)'});
    }

});



app.put('/users/:id', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const { name, email, age } = req.body;
  

    if(!name || typeof name !== 'string'){
        return res.status(400).json({error: 'il campo nome è obbligatorio e deve essere una stringa è non può essere vuoto'});
      } 
    
      if(!email || typeof email !== 'string'){
        return res.status(400).json({error: 'il campo email è obbligatorio è non deve essere vuoto'});
      }
    
      if(!age || typeof age !== 'number' || age <= 0){
        return res.status(400).json({error: 'il campo anni è obbligatorio è non deve essere vuoto'});
      }
    
     try {
        const risultato = await pool.query(
            'UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING *',
            [name, email, age, userId]
      );
  
      if (risultato.rows.length === 0) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }
  
      res.json(risultato.rows[0]);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Abbiamo un problema, non riusciamo ad aggiornare l\'utente (sistema il codice)' });
    }
  });
  

  app.delete('/users/:id', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id); 

    try {
      const risultato = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [userId]
      );
  
      if (risultato.rowCount === 0) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }
  
      res.json({ message: 'Utente eliminato con successo' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Non riusciamo ad eliminare l\'utente. (Sistema il codice)' });
    }
  });
  



app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
