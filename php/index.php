<?php
error_reporting(E_ALL & ~E_NOTICE);

$SAIL_SETTINGS = json_decode(file_get_contents('../settings.json'));

require_once('functions.php');
$dbSelf = $GLOBALS['dbSelf'];

if(trim($_GET['cmd'])!=''){
    $response = array();
    switch($_GET['cmd']){


        case 'board':
            $boardId = $_GET['board'];
            $request_body = file_get_contents('php://input');

            if($request_body){
                $payload = json_decode($request_body);
                $id = saveBoard($boardId, $payload->config);
                if($id === false){
                    header('HTTP/1.1 500 Internal Server Error');
                    $response['error'] = 'SAVE_FAILED';
                }else{
                    $response['id'] = $id;
                }
            }else{
                $board = getRecord($dbSelf, $SAIL_SETTINGS->db_self->prefix . 'board', $boardId);

                if($board){
                    $response = $board;
                }else{
                    header('HTTP/1.1 404 Not Found');
                    $response['error'] = 'NOT_FOUND';
                }
            }



            break;

        case 'query':
            $query = $_POST['query'];
            $queryOri = $query;

            //process the sql tree
            $sql2tree = new dqml2tree($query);
            $sqlTree = $sql2tree->make();

            //count the total query rows before adding limit
            $count = countQuery($query,$sqlTree);

            //limit the query and execute
            makeLimitedQuery($query,$sqlTree);
            $result = execQuery($query);

            $response['countTotal'] = (int)$count;
            $response['rows'] = $result['rows'];
            $response['error'] = $result['sql_error'];
            break;

        case 'tables':

            //get all tables
            $tables = getDatabaseTables();
            $tables_flat = array_keys($tables);//perf
            $contextMenu=array();

            //get description for every table
            foreach($tables as $table=>$v){
                $tables[$table] = getTableDescription($table);
                $listFields = array();

                foreach($tables[$table]['__fields'] as $field){
                    $listFields[] = array('name'=>$field);
                }

                $contextMenu[] = array(
                    'name'=>$table,
                    'fields'=>$listFields
                );
            }

            $response['tables'] = $tables;
            break;
    }
    //header('Content-type: application/json');
    echo json_encode($response);
}

