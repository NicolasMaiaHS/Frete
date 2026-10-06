let botao = document.getElementById("calcular");

botao.addEventListener("click", async function() {

    let cep = document.getElementById("cep").value;
    let resultado = document.getElementById("resultado");

    cep = cep.replace("-", "");

    if (cep.length != 8) {
        resultado.innerHTML = "Digite um CEP válido.";
        return;
    }

    resultado.innerHTML = "Consultando...";

    
    let resposta = await fetch(
        "https://viacep.com.br/ws/" + cep + "/json/"
    );

    let endereco = await resposta.json();

    if (endereco.erro) {
        resultado.innerHTML = "CEP não encontrado.";
        return;
    }

    
    resultado.innerHTML = `
        <p>
            <strong>Endereço:</strong><br>
            ${endereco.logradouro}, ${endereco.bairro}<br>
            ${endereco.localidade} - ${endereco.uf}
        </p>
    `;

    
    let url = "https://nominatim.openstreetmap.org/search?" +
        "street=" + encodeURIComponent(endereco.logradouro) +
        "&city=" + encodeURIComponent(endereco.localidade) +
        "&state=" + encodeURIComponent(endereco.uf) +
        "&postalcode=" + cep +
        "&country=Brazil" +
        "&format=json" +
        "&limit=1";

    let respostaMapa = await fetch(url);

    let local = await respostaMapa.json();

    if (local.length == 0) {
        resultado.innerHTML +=
            "<p>Não foi possível encontrar a localização.</p>";
        return;
    }

    let latitude = parseFloat(local[0].lat);
    let longitude = parseFloat(local[0].lon);

    
    let latitudeUninassau = -3.7856;
    let longitudeUninassau = -38.5697;

    
    let distancia = Math.sqrt(
        (latitude - latitudeUninassau) ** 2 +
        (longitude - longitudeUninassau) ** 2
    ) * 111;

    
    let uber = distancia * 1.40;

    
    let frete = uber + 5;

    resultado.innerHTML += `
        <p>
            <strong>Distância:</strong>
            ${distancia.toFixed(2)} km
        </p>

        <p>
            <strong>Uber Moto estimado:</strong>
            R$ ${uber.toFixed(2)}
        </p>

        <p>
            <strong>Frete:</strong>
            R$ ${frete.toFixed(2)}
        </p>
    `;

});
