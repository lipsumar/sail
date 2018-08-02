<?php
require_once('./dqml2tree.php');

// connect to self db
if($GLOBALS['SAIL_SETTINGS']['db_self']){
    $dbSelf = mysqli_connect(
        $GLOBALS['SAIL_SETTINGS']['db_self']['host'],
        $GLOBALS['SAIL_SETTINGS']['db_self']['user'],
        $GLOBALS['SAIL_SETTINGS']['db_self']['pass']
    ) or die('Unable to connect to self DB.<br/>MySQL said: '.mysqli_error());
    mysqli_select_db($dbSelf, $GLOBALS['SAIL_SETTINGS']['db_self']['name']) or die('Connected to self DB, but unable to select database.<br/>MySQL said: '.mysql_error());
}


// connect to target db
$dbTarget = mysqli_connect(
    $GLOBALS['SAIL_SETTINGS']['db_target']['host'],
    $GLOBALS['SAIL_SETTINGS']['db_target']['user'],
    $GLOBALS['SAIL_SETTINGS']['db_target']['pass'],
    true // make a new connexion, don't reuse previous
) or die('Unable to connect to target DB.<br/>MySQL said: '.mysqli_error());
mysqli_select_db($dbTarget, $GLOBALS['SAIL_SETTINGS']['db_target']['name']) or die('Connected to target DB, but unable to select database.<br/>MySQL said: '.mysql_error());



function getDatabaseTables(){
    global $dbTarget;
	$tables = array();
	$query = 'SHOW tables';
	$res = mysqli_query($query, $dbTarget);
	while($r = mysqli_fetch_array($res)){
		$tables[$r[0]] = 1;
	}
	return $tables;
}

function getTableDescription($table){
    global $dbTarget;
	$describe = array();
	$query = 'DESCRIBE '.sqle($table);
	$res = mysqli_query($query, $dbTarget);
	while($r = mysqli_fetch_assoc($res)){
		$describe['__fields'][] = $r['Field'];
		$describe[$r['Field']] = $r;
		if($r['Key']=='PRI') $describe['__PRI'] = $r['Field'];
	}
	return $describe;
}

//sql escape
function sqle($s){ return mysqli_real_escape_string($s); }

//make sure a query has a limit
function makeLimitedQuery(&$query,&$sqlTree){
	if(!queryHasLimit($query,$sqlTree)){
		$query .= ' LIMIT 0,30';

		//query changed, remake the tree as well
		$sql2tree = new dqml2tree($query);
		$sqlTree = $sql2tree->make();
	}

}
function queryHasLimit($query,$sqlTree){


	$hasLimit = false;
	if(isset($sqlTree['SQL']['SELECT']['LIMIT'])) $hasLimit = true;

	return $hasLimit;
}

function findInQuery(){
	//get the boundaries
}

//wont touch the query
function execQuery($query){
    global $dbTarget;

	$result = array('query'=>$query);
	$timeBegin = microtime(true);
	$res = mysqli_query($query, $dbTarget);
	$timeEnd = microtime(true);
	$result['duration_ms'] = ($timeEnd - $timeBegin) * 1000;
	$mysql_error = mysqli_error();
	if($mysql_error!=''){
		$result['sql_error'] = $mysql_error;
	}else{
		$i=0;
		$result['rows'] = array();
		$result['headers'] = array();
		while($row = mysqli_fetch_assoc($res)){
			if($i==0) foreach($row as $fieldName=>$fieldValue) $result['headers'][] = $fieldName;
			foreach($row as $k=>$v){
				$length = mb_strlen($v);
				$v = mb_substr($v,0,100);
				$v = utf8_encode($v);
				$row[$k] = htmlspecialchars($v).($length>100?'&hellip;':'');
			}

			$result['rows'][] = $row;
			$i++;
		}
	}
	return $result;
}

function countQuery($query,$sqlTree){
    global $dbTarget;

    //small security. need to handle more cases (all actually)...
    if(preg_match('/^select \\*[\\s\\S]*?from/i',$query)){
        $query = preg_replace('/^select \\*[\\s\\S]*?from/i','select count(*) as total from',$query);
        $res = mysqli_query($query, $dbTarget);
        $mysql_error = mysqli_error();
        if($mysql_error){
            return false;
        }
        $r = mysqli_fetch_assoc($res);
        return $r['total'];
    }

	//...so we don't end up doing this
	$res = mysqli_query($query, $dbTarget);
	$mysql_error = mysqli_error();
	if($mysql_error==''){
		return mysqli_num_rows($res);
	}
	return false;
}


function getRecord($db, $table, $uid, $uidField = 'id', $andWhere = '')
{
    $q = 'select * from ' . $table . ' where ' . $uidField . '=\'' . $uid . '\' ' . $andWhere . ' limit 1';
    //echo $q;
    $res = mysqli_query($q, $db);

    return mysqli_fetch_assoc($res);
}
function getRecords($db, $table, $where = '1=1', $group = '', $order = '', $limit = 0)
{
    $q = 'select * from ' . $table . ' where ' . $where . ' ' . $group . ' ' . $order . ($limit > 0 ? 'limit ' . $limit : '');
    //echo $q;
    $res = mysqli_query($q, $db);
    $re = [];
    while ($r = mysqli_fetch_assoc($res)) {
        $re[] = $r;
    }

    return $re;
}


function saveBoard($id, $config, $vars){
    global $dbSelf;
    $table = $GLOBALS['SAIL_SETTINGS']['db_self']['prefix'] . 'board';
    $existing = getRecord($dbSelf, $table, $id);
    if($existing && $id!=='new'){
        $q = 'update '.$table.' set config=\''.addslashes($config).'\', vars=\''.implode(',',$vars).'\' where id=\''.addslashes($id).'\'';
    }else{
        if($id === 'new'){
            $id = generateId($table);
        }
        $q = 'insert into '.$table.' set id=\''.$id.'\', crdate='.time().', config=\''.addslashes($config).'\', vars=\''.implode(',',$vars).'\'';
    }

    if(mysqli_query($q, $dbSelf)){
        return $id;
    }
    return false;
}

function generateId($table){
    global $dbSelf;
    while(true){
        $try = substr(md5(uniqid(rand(), true)), 0, 8);
        $existing = getRecord($dbSelf, $table, $try);
        if(!$existing) break;
    }
    return $try;
}

?>
