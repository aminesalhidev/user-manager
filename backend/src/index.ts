// src/index.ts
import express, { query, Request, Response } from 'express';
import pool, { VerificaConnesione } from './databasepg/db'; // Importa pool e la funzione di verifica
import cors from 'cors';
const app = express();
const port = 3000;

app.use(express.json());



/*
app.use(cors({
 origin: 'http://localhost:3001',
 methodS: ['GET, 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // Aggiungi questa linea per abilitare CORS
*/



VerificaConnesione();



// Rotta per ottenere tutti gli utenti
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
    // Estrai l'ID dall'URL e convertilo in numero
    const userId = parseInt(req.params.id);
    // Estrai i dati dal corpo della richiesta
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
      // Esegui la query di aggiornamento
      const risultato = await pool.query(
        'UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING *',
        [name, email, age, userId]
      );
  
      // Verifica se l'utente è stato trovato e aggiornato
      if (risultato.rows.length === 0) {
        // Se non ci sono righe restituite, l'utente non esiste
        return res.status(404).json({ error: 'Utente non trovato' });
      }
  
      // Restituisci l'utente aggiornato
      res.json(risultato.rows[0]);
  
    } catch (err) {
      // Gestione degli errori
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
  
      // Controlla se la query ha eliminato qualche record
      if (risultato.rowCount === 0) {
        // Se nessun record è stato eliminato, restituisci un errore 404
        return res.status(404).json({ error: 'Utente non trovato' });
      }
  
      // Se l'eliminazione è avvenuta correttamente, restituisci un messaggio di successo
      res.json({ message: 'Utente eliminato con successo' });
    } catch (err) {
      // Gestisci gli errori in caso di problemi con la query
      console.error(err);
      res.status(500).json({ error: 'Non riusciamo ad eliminare l\'utente. (Sistema il codice)' });
    }
  });
  



app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
