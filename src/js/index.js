const container = document.querySelector(".audio-visualizer");
const playIcon = document.querySelector("#play-icon");
const bgVideo = document.querySelector(".bg-video");
const canvas = document.querySelector("#canvas1");

//canvas width e height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Criar contexto canvas 2d
const ctx = canvas.getContext("2d");

//Variaveis customizadas
let audioSrc;
let analyser;
let isPlaying = false;
let animation;
let audioCtx;

//Função desenhar linha horizontal embaixo
function drawLine() {
    //Desenhar linha
    ctx.beginPath()
    ctx.moveTo(0, canvas.height - 2);
    ctx.lineTo(canvas.width, canvas.height - 2);
    ctx.strokeStyle = "#5D3FD3";
    ctx.lineWidth = 3;
    ctx.stroke();
}
drawLine();

//Adicionar evento de click no container principal
container.addEventListener("click", () => {
    //Variavel customizada para o audio
    let audio;
    //Se o track ainda não estiver tocando
    if(isPlaying === false) {
        //Botão de pausa
        playIcon.classList.add("fa-pause");
        playIcon.classList.remove("fa-play");
        //Tocar o video em background
        bgVideo.play();
        //Pasta do audio
        audio = new Audio("./src/audio/track.mp3");
        //Audio Contexto
        audioCtx = new AudioContext();
        //Tocar o audio
        audio.play();
        //Pegar a raiz do audio
        audioSrc = audioCtx.createMediaElementSource(audio);
        //Nodulo analyser
        analyser = audioCtx.createAnalyser();
        //Conectar a raiz do audio ao analyser
        audioSrc.connect(analyser);
        //Conectar o audio ao destino
        analyser.connect(audioCtx.destination);
        //numero de samples de audio
        analyser.fftSize = 512;
        //Pegar o numero de valores data
        const bufferLength = analyser.frequencyBinCount;
        //Criar um novo array com os pontos de data
        const dataArray = new Uint8Array(bufferLength);
        //Colocar a largura das barras
        const barWidth = canvas.width / bufferLength;
        //Customizar a altura da barra e a posição de cada barra no eixo X
        let barHeight;
        let x;
        //Animar a função
        function animate() {
            //Reseta a posição X
            x = 0;
            //Limpar o canvas totalmente
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //Pegar a frequencia de cada valor data
            analyser.getByteFrequencyData(dataArray);
            //Desenhar uma linha entre cada data point
            for(let i = 0; i < bufferLength; i++) {
                drawLine();
                barHeight = dataArray[i];
                ctx.fillStyle = "#5D3FD3";
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
                x += barWidth + 7;
            }
            //Solicitar animação frame 
            animation = window.requestAnimationFrame(animate);
        }
        //Rode a função animate
        animate();
        // o track está tocando (setar verdadeiro)
        isPlaying = true;
        //Se o audio está tocando
    } else {
        //Pare o audio
        audioCtx.suspend();
        //Colocar o icone de play
        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play");
        //Pause o video de fundo
        bgVideo.pause();
        //Cancelar animation frame
        window.cancelAnimationFrame(animation);
        //O audio parou (Setar Falso)
        isPlaying = false;
    }
});
