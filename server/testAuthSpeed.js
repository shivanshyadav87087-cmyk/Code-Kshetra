async function testSpeed() {
  const start = Date.now();
  const testUser = 'speed_user_' + Math.floor(Math.random() * 8999 + 1000);
  
  // Test Register Speed
  const regRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: testUser, password: 'PassWord123!' })
  });
  const regTime = Date.now() - start;
  console.log(`[Register Latency]: ${regTime}ms - Status: ${regRes.status}`);

  // Test Login Speed
  const loginStart = Date.now();
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: testUser, password: 'PassWord123!' })
  });
  const loginTime = Date.now() - loginStart;
  console.log(`[Sign In Latency]: ${loginTime}ms - Status: ${loginRes.status}`);

  process.exit(0);
}

testSpeed().catch(console.error);
