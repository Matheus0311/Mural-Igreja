document.addEventListener('DOMContentLoaded', () => {
    const muralImage = document.getElementById('mural-image');
    const muralPdf = document.getElementById('mural-pdf');
    const fileMessage = document.getElementById('file-message');
  
    function getFileExtension(filename) {
      return filename.split('.').pop().toLowerCase();
    }
  
    function updateMural() {
      fetch('/murais/latest')
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.text();
        })
        .then(filename => {
          const trimmedFilename = filename.trim();
          const fileUrl = `/murais/${trimmedFilename}`;
          const fileExtension = getFileExtension(trimmedFilename);
  
          if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            muralImage.src = fileUrl;
            muralImage.style.display = 'block';
            muralPdf.style.display = 'none';
            fileMessage.style.display = 'none';
          } else if (fileExtension === 'pdf') {
            muralPdf.src = fileUrl;
            muralPdf.style.display = 'block';
            muralImage.style.display = 'none';
            fileMessage.style.display = 'none';
          } else {
            fileMessage.textContent = 'Arquivo não suportado.';
            fileMessage.style.display = 'block';
            muralImage.style.display = 'none';
            muralPdf.style.display = 'none';
          }
        })
        .catch(err => {
          console.error('Erro ao atualizar mural:', err);
          fileMessage.textContent = 'Erro ao atualizar mural.';
          fileMessage.style.display = 'block';
          muralImage.style.display = 'none';
          muralPdf.style.display = 'none';
        });
    }
  
    setInterval(updateMural, 5000);
  
    document.getElementById('upload-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      fetch('/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(message => {
        console.log(message);
        updateMural(); // Atualiza o mural após o upload
      })
      .catch(err => console.error('Erro ao enviar arquivo:', err));
    });
  });
