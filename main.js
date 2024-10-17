const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const statusMsg = document.getElementById('status-msg');
const textArea = document.getElementById('text-area');
let recognition;

async function startSpeechRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    statusMsg.textContent = 'Error starting recognition';
    return;
  }

  const model = await tf.loadLayersModel('/tfjs_model/model.json');

  recognition = new webkitSpeechRecognition();

  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    statusMsg.textContent = 'Listening...';
  };

  recognition.onresult = function(event) {
    const resultIndex = event.resultIndex;
    const transcript = event.results[resultIndex][0].transcript;
    
    if (textArea.textContent !== transcript) {
      textArea.textContent = transcript;
      processTranscription(transcript, model);
    }
  };

  recognition.onend = function() {
    statusMsg.textContent = 'Listening ended!';
  };

  recognition.start();
}

function stopSpeechRecognition() {
  if (recognition) {
    recognition.stop();
    statusMsg.textContent = 'Listening stopped!';
  }
}

function processTranscription(transcription, model) {
  const prediction = model.predict(transcription);
  textArea.textContent += prediction;
}

startBtn.addEventListener('click', startSpeechRecognition);
stopBtn.addEventListener('click', stopSpeechRecognition);
