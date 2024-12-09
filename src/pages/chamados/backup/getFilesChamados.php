<?php

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');


class Files
{
    function uploadImg($params)
    {
        $cnpj = preg_replace('/[^0-9]/', '', $params['cnpj']);
        $idChamado = $params['idChamado'];
        $dirBase = './';
        $dirCNPJ = $dirBase . $cnpj . '/';

        // Criar diretório se não existir
        if (!is_dir($dirCNPJ)) {
            if (!mkdir($dirCNPJ, 0777, true)) {
                echo json_encode(['success' => false, 'msg' => "Erro ao criar o diretório {$dirCNPJ}."]);
                return;
            }
        }

        $uploadedFiles = [];

        // Verificar se arquivos foram enviados
        if (!isset($_FILES['files']['tmp_name'])) {
            echo json_encode(['success' => false, 'msg' => 'Nenhum arquivo foi enviado.']);
            return;
        }

        foreach ($_FILES['files']['tmp_name'] as $key => $tmpName) {
            if ($_FILES['files']['error'][$key] !== UPLOAD_ERR_OK) {
                echo json_encode(['success' => false, 'msg' => "Erro no upload do arquivo {$key}: {$_FILES['files']['error'][$key]}."]);
                return;
            }

            $timestamp = date('d-m-Y-H-i-s');
            // Detectar a extensão original do arquivo
            $originalName = $_FILES['files']['name'][$key];
            $extension = pathinfo($originalName, PATHINFO_EXTENSION);

            // Criar o nome do arquivo com a extensão correta
            $filename = "{$idChamado}-{$timestamp}-{$key}.{$extension}";
            $filePath = $dirCNPJ . $filename;

            if (move_uploaded_file($tmpName, $filePath)) {
                $uploadedFiles[] = "http://www.reallatas.com.br/chamados/{$cnpj}/{$filename}";
            } else {
                echo json_encode(['success' => false, 'msg' => "Falha ao mover o arquivo {$key}."]);
                return;
            }
        }

        echo json_encode([
            'success' => true,
            'msg' => 'Arquivos enviados com sucesso!',
            'files' => $uploadedFiles
        ]);
    }

    function getImgChamado()
    {
        $jsonData = file_get_contents('php://input'); // Captura o corpo JSON da requisição
        $data = json_decode($jsonData, true); // Decodifica os dados JSON para um array associativo

        // Valida se os dados esperados foram enviados
        if (!isset($data['cnpj'], $data['id_chamado'])) {
            echo json_encode(['error' => 'Dados incompletos: cnpj ou id_chamado ausentes.']);
            return;
        }

        $cnpj = preg_replace('/[^0-9]/', '', $data['cnpj']); // Normaliza o CNPJ
        $id_chamado = $data['id_chamado']; // Captura o ID do chamado

        // Verifique se o diretório do cliente existe
        $dir = "./" . $cnpj;

        if (!is_dir($dir)) {
            echo json_encode(['error' => 'O diretório não existe.']);
            return;
        }

        $files = scandir($dir);
        if (!$files) {
            echo json_encode(['error' => 'Erro ao acessar o diretório.']);
            return;
        }

        $result = [];
        foreach ($files as $file) {
            if (strpos($file, $id_chamado . '-') === 0) { // Verifica se o arquivo começa com o ID do chamado
                $result[] = $file;
            }
        }

        echo json_encode($result);
    }

    function removerImagemChamado($params)
    {
        // Normalizar o CNPJ para evitar caracteres indesejados
        $cnpj = preg_replace('/[^0-9]/', '', $params['cnpj']);
        $nomeImagem = $params['nomeImagem'];

        // Diretório base para imagens
        $dirCNPJ = './' . $cnpj . '/';

        // Verificar se o arquivo existe
        $filePath = $dirCNPJ . $nomeImagem;

        if (!file_exists($filePath)) {
            echo json_encode(['success' => false, 'msg' => 'O arquivo não foi encontrado.']);
            return;
        }

        // Tentar excluir o arquivo
        if (unlink($filePath)) {
            echo json_encode(['success' => true, 'msg' => 'Imagem removida com sucesso.']);
        } else {
            echo json_encode(['success' => false, 'msg' => 'Falha ao excluir o arquivo.']);
        }
    }
}

// Identificar a `call` corretamente
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

$call = $_REQUEST['call'] ?? $data['call'] ?? null;

if (!$call) {
    echo json_encode(['success' => false, 'msg' => 'Chamada não especificada.']);
    exit;
}

$class = new Files();

if (method_exists($class, $call)) {
    if ($call === 'uploadImg') {
        // `uploadImg` usa `$_FILES` e `$_POST`
        $class->$call($_POST);
    } elseif ($call === 'removerImagemChamado') {
        // `removerImagemChamado` usa o corpo JSON
        $class->$call($data);
    } else {
        // Para chamadas como `getImgChamado`, usamos o corpo JSON
        $class->$call($data);
    }
} else {
    echo json_encode(['success' => false, 'msg' => "Função '{$call}' não encontrada."]);
}
