<?php
session_start();
include('connection.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $recipeId = $_POST['id'];

    $checkQuery = "SELECT * FROM recipes WHERE id = $recipeId";
    $checkResult = $con->query($checkQuery);

    if ($checkResult->num_rows > 0) {

        $targetDir = "../images/recipes/";    
        $row = $checkResult->fetch_assoc();
        $imagePath = $row['image_path'];
        
        $deleteRecipeQuery = "DELETE FROM recipes WHERE id = $recipeId";
        $deleteNutritionalQuery = "DELETE FROM nutritional_value WHERE recipe_id = $recipeId";
        $deleteIngredientsQuery = "DELETE FROM ingredients WHERE recipe_id = $recipeId";
        $deleteProceduresQuery = "DELETE FROM procedures WHERE recipe_id = $recipeId";

        if (
            $con->query($deleteRecipeQuery) &&
            $con->query($deleteNutritionalQuery) &&
            $con->query($deleteIngredientsQuery) &&
            $con->query($deleteProceduresQuery)
        ) {
            unlink($targetDir . basename($imagePath));
            echo 'success';
        } else {
            echo 'error';
        }
    } else {
        echo 'not_found';
    }
} else {
    echo 'invalid_request';
}

$con->close();
?>