<?php
session_start();
include('connection.php');

function uploadImage() {
    $targetDir = "../images/recipes/";
    $targetFile = $targetDir . basename($_FILES["recipe_image"]["name"]);
    move_uploaded_file($_FILES["recipe_image"]["tmp_name"], $targetFile);
    return $targetFile;
}

function getFilePath() {
    $filepath = "./images/recipes/";
    $filepath = $filepath . basename($_FILES["recipe_image"]["name"]);
    return $filepath;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $recipeName = $_POST["recipe_name"];
    $calories = $_POST["calories"];
    $fat = $_POST["fat"];
    $protein = $_POST["protein"];
    $carbs = $_POST["carbs"];
    $numberOfProcedure = (int) $_POST['numberOfProcedure'];
    $numberOfIngredient = (int) $_POST['numberOfIngredient'];

    $imagePath = uploadImage();
    $filepath = getFilePath();

    $stmt = $con->prepare("INSERT INTO recipes (`name`, image_path) VALUES (?, ?)");
    $stmt->bind_param("ss", $recipeName, $filepath);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $last_id = $con->insert_id;

        $stmt2 = $con->prepare("INSERT INTO nutritional_value (recipe_id, calories, fat, protein, carbs) VALUES (?, ?, ?, ?, ?)");
        $stmt2->bind_param("sssss", $last_id, $calories, $fat, $protein, $carbs);
        $stmt2->execute();

        for($x = 1; $x <= $numberOfProcedure; $x++) {
            $proc = "procedure_" . $x;
            $stmt3 = $con->prepare("INSERT INTO `procedures` (recipe_id, step_number, name) VALUES (?, ?, ?)");
            $stmt3->bind_param("sss", $last_id, $x, $_POST[$proc]);
            $stmt3->execute();
        }

        for($x = 1; $x <= $numberOfIngredient; $x++) {
            $ind = "ingredient_" . $x;
            $stmt3 = $con->prepare("INSERT INTO ingredients (recipe_id, name) VALUES (?, ?)");
            $stmt3->bind_param("ss", $last_id, $_POST[$ind]);
            $stmt3->execute();
        }
        $output = array (
            "status" => "success"
        );
    } else {
        $output = array (
            "status" => "error"
        );
    }
    $stmt->close();
    echo json_encode($output);
}
$con->close();
?>