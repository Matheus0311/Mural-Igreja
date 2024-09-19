document.addEventListener('DOMContentLoaded', () => {
    const muralImage = document.getElementById('mural-image');
    const muralPdf = document.getElementById('mural-pdf');
    const fileMessage = document.getElementById('file-message');
    const uploadFeedback = document.getElementById('upload-feedback');
    let files = [];
    let currentIndex = 0;

    function getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    function updateMural() {
        fetch('/murais/list')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                if (data.startsWith('<!DOCTYPE html>')) {
                    // Se receber HTML, trata como a página de contato
                    document.body.innerHTML = data;
                    return;
                }
                files = JSON.parse(data);
                if (files.length === 0) {
                    fileMessage.textContent = 'Nenhum arquivo encontrado.';
                    fileMessage.style.display = 'block';
                    muralImage.style.display = 'none';
                    muralPdf.style.display = 'none';
                    return;
                }
                const filename = files[currentIndex];
                const fileUrl = `/murais/${filename}`;
                const fileExtension = getFileExtension(filename);

                if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                    muralImage.src = fileUrl;
                    muralImage.style.display = 'block';
                    muralPdf.style.display = 'none';
                } else if (fileExtension === 'pdf') {
                    muralPdf.src = fileUrl;
                    muralPdf.style.display = 'block';
                    muralImage.style.display = 'none';
                } else {
                    fileMessage.textContent = 'Arquivo não suportado.';
                    fileMessage.style.display = 'block';
                    muralImage.style.display = 'none';
                    muralPdf.style.display = 'none';
                }
                currentIndex = (currentIndex + 1) % files.length; // Move para o próximo arquivo
            })
            .catch(err => {
                console.error('Erro ao atualizar mural:', err);
                fileMessage.textContent = 'Erro ao atualizar mural.';
                fileMessage.style.display = 'block';
                muralImage.style.display = 'none';
                muralPdf.style.display = 'none';
            });
    }

    setInterval(updateMural, 5000); // Atualiza a cada 5 segundos

    document.getElementById('upload-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(message => {
            uploadFeedback.textContent = 'Arquivo enviado com sucesso!';
            uploadFeedback.style.color = 'green';
            updateMural(); // Atualiza o mural após o upload
        })
        .catch(err => {
            console.error('Erro ao enviar arquivo:', err);
            uploadFeedback.textContent = 'Erro ao enviar o arquivo.';
            uploadFeedback.style.color = 'red';
        });
    });
});
