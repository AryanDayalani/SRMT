import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
    console.log('--- Starting Backend Verification ---');

    // 1. Register User
    console.log('\n1. Testing Registration...');
    const userPayload = {
        email: `test_${Date.now()}@example.com`,
        password: 'password123',
        role: 'researcher',
        registrationNumber: 'REG123456'
    };

    let token = '';

    try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userPayload)
        });

        const data: any = await res.json();
        console.log('Registration Status:', res.status);
        if (res.status === 201) {
            console.log('User Registered:', data.email);
            token = data.token;
        } else {
            console.error('Registration Failed:', data);
            process.exit(1);
        }
    } catch (e) {
        console.error('Registration Error:', e);
        process.exit(1);
    }

    // 2. Create Project
    console.log('\n2. Testing Create Project...');
    const projectPayload = {
        name: 'AI in Healthcare',
        description: 'Deep learning for diagnosis',
        track: 'healthcare',
        format: 'ieee',
        collaborators: [
            { name: 'Dr. Guide', email: 'guide@example.com', role: 'guide' }
        ]
    };

    try {
        const res = await fetch(`${BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(projectPayload)
        });

        const data: any = await res.json();
        console.log('Create Project Status:', res.status);
        if (res.status === 201) {
            console.log('Project Created:', data.name);
        } else {
            console.error('Create Project Failed:', data);
        }
    } catch (e) {
        console.error('Create Project Error:', e);
    }

    // 3. Get Projects
    console.log('\n3. Testing Get Projects...');
    try {
        const res = await fetch(`${BASE_URL}/projects`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data: any = await res.json();
        console.log('Get Projects Status:', res.status);
        console.log('Projects Count:', Array.isArray(data) ? data.length : 'Error');
        if (Array.isArray(data) && data.length > 0) {
            console.log('Verified: Project list retrieved successfully.');
        }
    } catch (e) {
        console.error('Get Projects Error:', e);
    }

}

runTests();
