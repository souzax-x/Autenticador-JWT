const loginform = document.getElementById('loginform');

loginform.addEventListener("submit", async (e) => {
    e.preventDefault();

    let email = document.getElementById('Email').value;
    let password = document.getElementById('senha').value;

    try {
        const response = await fetch("https://autenticador-jwt.onrender.com/auth/login", {
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

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then((registration) => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch((error) => {
                console.log('Falha ao registrar o Service Worker:', error);
            });
    });
}

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        console.log('Localização:', position.coords.latitude, position.coords.longitude);
    }, (error) => {
        console.error('Erro ao obter geolocalização:', error);
    });
} else {
    console.log("Geolocalização não está disponível no seu navegador.");
}
