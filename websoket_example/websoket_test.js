const WebSocket = require('ws');
const oracledb = require('oracledb');

// Oracle DB connection configuration
const dbConfig = {
  user: 'sys',
  password: 'Manager_2023',
  connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=DESKTOP-F3ETQJJ)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=XE)))',
  privilege: oracledb.SYSDBA
};

// Create a new WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Function to fetch data from Oracle database
async function fetchDataFromOracle() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // Execute SQL query to get the counts and other params
    const result = await connection.execute(`
      SELECT
        to_char(sysdate, 'DD.MM.YYYY HH24:MI:SS') AS count1,
        '11' AS count2,
        '0' AS count3
      FROM dual
    `);

    console.log(result);

    // Assuming result.rows contains the counts
    const [row] = result.rows;
    const data = {
      count1: row[0],
      count2: row[1],
      count3: row[2]
      // Add more params as needed
    };

    return data;
  } catch (err) {
    console.error('Error fetching data from Oracle:', err);
    return null;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

// Broadcast data to all connected clients
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Fetch data and broadcast to clients
async function updateClients() {
  const data = await fetchDataFromOracle();
  if (data) {
    broadcast(data);
  }
}

// Periodically fetch data and update clients
setInterval(updateClients, 10000); // Adjust interval as needed

// Handle client connections
wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on port 8080');
