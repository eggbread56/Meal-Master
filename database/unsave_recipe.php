<?php
session_start();
include('connection.php');
$data = file_get_contents("php://input");

$request = json_decode($data);

if (isset($request->recipeId)) {
    $recipeId = $request->recipeId;
    $userId = $_SESSION['id'];
    $sql = "DELETE FROM `saved_recipes` WHERE `recipe_id` = $recipeId AND `user_id` = $userId";
    
    $query = mysqli_query($con, $sql);

    if ($query) {
        $response = array('status' => 'true');
    } else {
        $response = array('status' => 'false');
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}
$con->close();
?>