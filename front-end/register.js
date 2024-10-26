const loginform = document.getElementById('loginform')

loginform.addEventListener("submit", async (e) => {
    e.preventDefault();

    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let password = document.getElementById('senha').value
    let confirmepassword = document.getElementById('confirme_senha').value

    try {
        const response = await fetch("https://autenticador-jwt.onrender.com/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name, email, password, confirmepassword}),
        });

        const data = await response.json();

        if(response.ok){
            alert(data.msg);
            window.location.href = "index.html"
        }else{
            alert(data.msg);
        }
    } catch (error) {
        console.error("Erro ao fazer login", error);
    }

});