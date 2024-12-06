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
            $filename = "{$idChamado}-{$timestamp}-{$key}.jpg";
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
    } else {
        // Para chamadas como `getImgChamado`, usamos o corpo JSON
        $class->$call($data);
    }
} else {
    echo json_encode(['success' => false, 'msg' => "Função '{$call}' não encontrada."]);
}