const fetch = require('node-fetch');

const testAdminLogin = async () => {
  try {
    console.log('Testing admin login functionality...');
    
    // Test 1: Login with correct credentials
    console.log('\n1. Testing login with correct credentials...');
    const loginResponse = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (loginResponse.ok && loginData.token) {
      console.log('✓ Login successful');
      
      // Test 2: Verify token
      console.log('\n2. Testing token verification...');
      const verifyResponse = await fetch('http://localhost:3001/api/admin/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });

      const verifyData = await verifyResponse.json();
      console.log('Verify response:', verifyData);

      if (verifyResponse.ok && verifyData.user) {
        console.log('✓ Token verification successful');
        console.log('User data:', verifyData.user);
      } else {
        console.log('✗ Token verification failed');
      }
    } else {
      console.log('✗ Login failed');
    }

    // Test 3: Login with wrong credentials
    console.log('\n3. Testing login with wrong credentials...');
    const wrongLoginResponse = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'wrongpassword'
      })
    });

    const wrongLoginData = await wrongLoginResponse.json();
    console.log('Wrong login response:', wrongLoginData);

    if (!wrongLoginResponse.ok && wrongLoginData.message) {
      console.log('✓ Wrong credentials properly rejected');
    } else {
      console.log('✗ Wrong credentials not properly handled');
    }

    console.log('\nAdmin login test completed!');
  } catch (error) {
    console.error('Error during testing:', error);
  }
};

// Run the test
testAdminLogin();