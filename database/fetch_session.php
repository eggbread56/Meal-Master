<?php
session_start();

if(isset($_SESSION['name'])) {
    $user = array(
        "id" => $_SESSION['id'],
        "name" => $_SESSION['name'],
        "user_role" => $_SESSION['role']
    );
    echo json_encode($user);
}
?>