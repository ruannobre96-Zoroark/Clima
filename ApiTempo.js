window.onload = function () {
  let dadosArmazenados = localStorage.getItem("formulario");
  if (dadosArmazenados) {
    let dados = JSON.parse(dadosArmazenados);

    document.getElementById("nome").value = dados.nome || "";
    document.getElementById("email").value = dados.email || "";
    document.getElementById("telefone").value = dados.telefone || "";
    document.getElementById("cep").value = dados.cep || "";
    document.getElementById("logradouro").value = dados.logradouro || "";
    document.getElementById("bairro").value = dados.bairro || "";
    document.getElementById("cidade").value = dados.cidade || "";
    document.getElementById("estado").value = dados.estado || "";

  }
};

function salvar() {
  let nome = document.getElementById("nome").value;
  let email = document.getElementById("email").value;
  let telefone = document.getElementById("telefone").value;
  let cep = document.getElementById("cep").value;
  let logradouro = document.getElementById("logradouro").value;
  let bairro = document.getElementById("bairro").value;
  let cidade = document.getElementById("cidade").value;
  let estado = document.getElementById("estado").value;

  let dados = { nome, email, telefone, cep, logradouro, bairro, cidade, estado };
  localStorage.setItem("formulario", JSON.stringify(dados));

  alert("Dados salvos com sucesso!");
}

function limpar() {
  localStorage.removeItem("formulario");
  document.getElementById("formulario").reset();
  alert("Os dados foram removidos com sucesso!");
}

function buscarCEP() {
  const cep = document.getElementById("cep").value;
  const loadingElement = document.getElementById("loading");

  loadingElement.style.display = "block";

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {

      if (data.erro) {
        alert("CEP não encontrado!");
        loadingElement.style.display = "none";
        return;
      }

      document.getElementById("logradouro").value = data.logradouro || "";
      document.getElementById("bairro").value = data.bairro || "";
      document.getElementById("cidade").value = data.localidade || "";
      document.getElementById("estado").value = data.uf || "";

      loadingElement.style.display = "none";
    })
    .catch(() => {
      alert("Erro ao buscar o CEP!");
      loadingElement.style.display = "none";
    });
}

function buscarCidade() {
  const cidade = document.getElementById("cidade").value;
  const loadingElement = document.getElementById("loading");

  loadingElement.style.display = "block";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=113e086b43234d183feef7d344612aab&lang=pt_br`)
    .then(response => response.json())
    .then(data => {

      let temperatura = (data.main.temp - 273.15).toFixed(2); //converte para celsius

      let tempElement = document.getElementById("temperatura");
      tempElement.textContent = `Temperatura: ${temperatura}°C`;

      if (temperatura < 15) tempElement.style.color = "blue";
      else if (temperatura <= 30) tempElement.style.color = "green";
      else tempElement.style.color = "red";

      document.getElementById("descricao").textContent = `Descrição: ${data.weather[0].description}`;
      document.getElementById("umidade").textContent = `Umidade: ${data.main.humidity}%`;
      document.getElementById("vento").textContent = `Vento: ${data.wind.speed} m/s`;

      let utcAgora = Date.now() + new Date().getTimezoneOffset() * 60000;
      let horaLocalCidade = new Date(utcAgora + data.timezone * 1000)
        .toLocaleTimeString("pt-BR", { hour12: false });

      document.getElementById("horario").textContent = `Horário Local: ${horaLocalCidade}`;

      loadingElement.style.display = "none";
    })
    .catch(() => {
      alert("Erro ao buscar clima!");
      loadingElement.style.display = "none";
    });
}
