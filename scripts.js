// Capturando os elementos do DOM
const stylizeButton = document.getElementById('stylize-button');
const downloadButton = document.getElementById('download-button');
const inputText = document.getElementById('input-text');
const outputTextContainer = document.getElementById('output-text-container');

// Função para estilizar o texto markdown
stylizeButton.addEventListener('click', async () => {
    let markdownText = inputText.value;

    if (!markdownText.trim()) {
        alert('Por favor, insira algum texto antes de estilizar.');
        return;
    }

    console.log('Texto inserido:', markdownText);

    try {
        // Fazer a requisição POST para o backend
        console.log('Enviando requisição para o backend...');
        const response = await fetch('http://127.0.0.1:5000/stylize-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: markdownText })
        });

        console.log('Resposta recebida do backend:', response);

        if (!response.ok) {
            throw new Error('Erro ao estilizar o texto');
        }

        // Receber o texto estilizado do backend
        const data = await response.json();
        console.log('Dados recebidos do backend:', data);
        const stylizedText = data.stylized_text;

        // Mostrar o texto estilizado na tela abaixo dos botões
        outputTextContainer.innerHTML = `<div class="stylized-output">${stylizedText}</div>`;
        console.log('Texto estilizado exibido no navegador.');
    } catch (error) {
        console.error('Erro:', error);
        alert('Houve um erro ao tentar estilizar o texto. Por favor, tente novamente.');
    }
});

// Função para baixar o documento estilizado em formato .docx
downloadButton.addEventListener('click', async () => {
    console.log('Solicitando download do documento...');

    try {
        // Fazer a requisição POST para o backend
        console.log('Enviando requisição para gerar o documento...');
        const response = await fetch('http://127.0.0.1:5000/generate-docx', {
            method: 'POST'
        });

        console.log('Resposta recebida do backend para download:', response);

        if (!response.ok) {
            throw new Error('Erro ao gerar o documento');
        }

        // Criar um link para download do arquivo .docx
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'texto_estilizado.docx';
        link.click();

        // Limpar URL temporária
        URL.revokeObjectURL(link.href);
        console.log('Documento baixado com sucesso.');
    } catch (error) {
        console.error('Erro:', error);
        alert('Houve um erro ao tentar gerar o documento. Por favor, tente novamente.');
    }
});
