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
        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);

        if (!isset($data['cnpj'], $data['id_chamado'])) {
            echo json_encode(['error' => 'Dados incompletos: cnpj ou id_chamado ausentes.']);
            return;
        }

        $cnpj = $data['cnpj'];
        $id_chamado = $data['id_chamado'];

        $dir = "./" . preg_replace('/[^0-9]/', '', $cnpj); // Limitar caracteres não numéricos no CNPJ

        // Verifica se o diretório existe
        if (!is_dir($dir)) {
            echo json_encode(['error' => 'O diretório não existe.']);
            return;
        }

        // Verifica se o diretório é legível
        if (!is_readable($dir)) {
            // Tentativa de mudar as permissões para 777
            if (chmod($dir, 0777)) {
                echo json_encode(['message' => 'Permissões de leitura e escrita foram ajustadas para o diretório.']);
            } else {
                echo json_encode(['error' => 'Falha ao alterar permissões do diretório.']);
                return;
            }
        }

        // Tenta escanear o diretório
        $files = scandir($dir);

        // Verifica se foi possível escanear o diretório
        if ($files === false) {
            echo json_encode(['error' => 'Falha ao ler o diretório.']);
            return;
        }

        $json = [];

        foreach ($files as $file) {
            // Ignora os diretórios '.' e '..'
            if ($file === '.' || $file === '..') {
                continue;
            }

            $extension = pathinfo($file, PATHINFO_EXTENSION);
            $name = pathinfo($file, PATHINFO_FILENAME);

            // Verifica se o nome do arquivo começa com "$id_chamado-" e a extensão é válida
            if (strpos($name, "$id_chamado-") === 0 && in_array(strtolower($extension), ['jpg', 'jpeg', 'pdf'])) {
                $json[] = $file;
            }
        }

        // Se não encontrar arquivos, exibe mensagem
        if (empty($json)) {
            echo json_encode(['message' => 'Nenhum arquivo encontrado para a avaria especificada.']);
        } else {
            echo json_encode($json);
        }
    }
}

// Verificar o método chamado
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Verificar o método chamado
if (!isset($_REQUEST['call'])) {
    echo json_encode(['success' => false, 'msg' => 'Chamada não especificada.']);
    exit;
}

$class = new Files();
$call = $_REQUEST['call'];

if (method_exists($class, $call)) {
    $class->$call($_REQUEST);
} else {
    echo json_encode(['success' => false, 'msg' => "Função '{$call}' não encontrada."]);
}