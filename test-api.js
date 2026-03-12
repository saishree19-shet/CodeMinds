async function testApi() {
    try {
        const response = await fetch('http://localhost:5000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: "TypeError: Cannot read property 'map' of undefined" })
        });

        const data = await response.json();
        console.log("Status Code:", response.status);
        console.log("Response Keys:", Object.keys(data));
        console.log("Response:", JSON.stringify(data, null, 2));

    } catch (err) {
        console.error("Fetch Error:", err.message);
    }
}

testApi();
