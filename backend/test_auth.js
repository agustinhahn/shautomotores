const http = require('http');

const postRequest = (path, data) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
};

const getRequest = (path, token) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 1,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
      });
  
      req.on('error', (e) => reject(e));
      req.end();
    });
  };

const runTests = async () => {
    console.log('Testing Registration...');
    const regData = JSON.stringify({
        full_name: 'Test Setup Admin',
        email: 'admin@shautomotores.com',
        password: 'password123',
        role: 'super_admin'
    });

    try {
        const regRes = await postRequest('/api/auth/register', regData);
        console.log('Register Response:', regRes);

        let token;
        if (regRes.status === 201) {
            token = regRes.body.token;
        } else if (regRes.status === 400 && regRes.body.message === 'User already exists') {
             console.log('User already exists, trying login...');
             const loginData = JSON.stringify({
                email: 'admin@shautomotores.com',
                password: 'password123'
             });
             const loginRes = await postRequest('/api/auth/login', loginData);
             console.log('Login Response:', loginRes);
             token = loginRes.body.token;
        }

        if (token) {
            console.log('Testing Get Me...');
            const meRes = await getRequest('/api/auth/me', token);
            console.log('Get Me Response:', meRes);
        }

    } catch (err) {
        console.error('Test Failed:', err);
    }
};

// Wait a bit for server to start
setTimeout(runTests, 2000);
