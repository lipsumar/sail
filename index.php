<?php
require_once('./settings.php');
?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Sail</title>
    <base href="<?php echo $SAIL_SETTINGS['path']; ?>">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link href="https://fonts.googleapis.com/css?family=Fira+Mono" rel="stylesheet">

    <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" href="favicon/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="favicon/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="favicon/manifest.json">
    <link rel="mask-icon" href="favicon/safari-pinned-tab.svg" color="#607d8b">
    <link rel="shortcut icon" href="favicon/favicon.ico">
    <meta name="msapplication-config" content="favicon/browserconfig.xml">
    <meta name="theme-color" content="#607d8b">

    <script>
        window.SailOptions = {
            dbSelf: <?php echo $SAIL_SETTINGS['db_self'] ? 'true' : 'false'; ?>,
            styledRows: <?php echo json_encode($SAIL_SETTINGS['styled_rows']); ?>
        };
    </script>
</head>
<body>
	<div id="app"></div>
    <script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
    <script src="node_modules/d3-timeline/src/d3-timeline.js"></script>
    <script src="./node_modules/ace-builds/src-noconflict/ace.js"></script>
    <script src="./node_modules/ace-builds/src-noconflict/ext-language_tools.js"></script>
	<script src="./bundle.js"></script>
</body>
</html>
