<?php
$SAIL_SETTINGS = [
    "db_self" => [
        "host" =>"localhost",
        "name" =>"sail",
        "user" =>"root",
        "pass" =>"root",
        "prefix" => ""
    ],
    "db_target" =>[
        "host" =>"localhost",
        "name" =>"employees",
        "user" =>"root",
        "pass" =>"root"
    ],
    "path" => "/Sail/",
    "styled_rows" =>[
        [
            "column" => "hidden",
            "value" => 1,
            "style" => "color: #999"
        ],
        [
            "column" => "deleted",
            "value" => 1,
            "style" => "text-decoration: line-through"
        ]
    ]
];
