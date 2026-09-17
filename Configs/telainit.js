import * as THREE from "three";

export function telaInit(iniciarJogo) {

  // ==========================
  // ESTADOS
  // ==========================

  let carregandoArquivos = false;
  let podeIniciar = false;
  let jogoIniciado = false;
  let houveErro = false;


  // ==========================
  // ELEMENTOS DO INDEX
  // ==========================

  const tela =
    document.getElementById("loadingScreen");

  const loadingProgress =
    document.getElementById("loadingProgress");

  const loadingText =
    document.getElementById("loadingText");

  const joystick =
    document.getElementById("joystick");


  // esconde o joystick enquanto carrega
  if (joystick) {
    joystick.style.visibility = "hidden";
  }


  // ==========================
  // ATUALIZAR BARRA
  // ==========================

  function atualizar(valor) {

    valor = Math.max(
      0,
      Math.min(valor, 100)
    );

    loadingProgress.style.width =
      valor + "%";

    loadingText.textContent =
      Math.floor(valor) + "%";

  }


  // ==========================
  // ERRO
  // ==========================

  function erro(
    mensagem = "Erro ao carregar"
  ) {

    houveErro = true;

    loadingText.textContent =
      mensagem;

  }


  // ==========================
  // CONCLUIR
  // ==========================

  function concluir() {

  atualizar(100);

  // espera o navegador desenhar o 100%
  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      if (tela) {
        tela.style.display = "none";
      }

      if (joystick) {
        joystick.style.visibility = "visible";
      }

      iniciarJogo();

    });

  });

}


  // ==========================
  // LIBERA O JOGO
  // ==========================

  function liberarJogo() {

  if (jogoIniciado) return;
  if (houveErro) return;
  if (!podeIniciar) return;
  if (carregandoArquivos) return;

  jogoIniciado = true;

  concluir();
}

  // ==========================
  // LOADING MANAGER
  // ==========================

  const manager =
    new THREE.LoadingManager();


  manager.onStart = (
    url,
    carregados,
    total
  ) => {

    carregandoArquivos = true;

    atualizar(0);

  };


  manager.onProgress = (
    url,
    carregados,
    total
  ) => {

    const porcentagem =
      (carregados / total) * 100;

    atualizar(porcentagem);

  };


  manager.onLoad = () => {

    carregandoArquivos = false;

    liberarJogo();

  };


  manager.onError = (url) => {

    erro(
      "Erro ao carregar recurso"
    );

    console.error(
      "Erro ao carregar:",
      url
    );

  };


  // ==========================
  // INDEX TERMINOU DE PREPARAR
  // ==========================

  function iniciar() {

    podeIniciar = true;

    liberarJogo();

  }


  // ==========================
  // RETORNO
  // ==========================

  return {
    manager,
    atualizar,
    erro,
    iniciar
  };
}