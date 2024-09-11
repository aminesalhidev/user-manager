// src/databasepg/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',      
  host: 'localhost',    
  database: 'user_manager', 
  password: 'Kaltouma01',  
  port: 5432,           
});


//funziona connessione dabase
export const VerificaConnesione = async () => {

    try {
        await pool.query('SELECT * FROM users'); // testing funzionamento bug
        console.log('Connessione al database riuscita');

    } catch (err){
        console.error(err);
        console.log('Errore di connessione nel database');

    }
}

export default pool;


