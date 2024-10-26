const loginform = document.getElementById('loginform')

loginform.addEventListener("submit", async (e) => {
    e.preventDefault();

    let email = document.getElementById('Email').value
    let password = document.getElementById('senha').value

    try {
        const response = await fetch("https://autenticador-jwt.onrender.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        });

        const data = await response.json();

        if(response.ok){
            alert(data.msg);
        }else{
            alert(data.msg);
        }
    } catch (error) {
        console.error("Erro ao fazer login", error);
    }

});