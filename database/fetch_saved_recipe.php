<?php
session_start();
include('connection.php');

$savedRecipes = [];
$userId = $_SESSION['id'];
$sql = "SELECT
        sr.id,
        sr.recipe_id,
        u.id AS user_id,
        r.name AS recipe_name,
        r.image_path AS recipe_image,
        GROUP_CONCAT(DISTINCT i.name SEPARATOR '| ') AS ingredients,
        GROUP_CONCAT(DISTINCT rp.name ORDER BY rp.step_number ASC SEPARATOR '| ') AS procedures
        FROM
        saved_recipes sr
        LEFT JOIN
        users u ON sr.user_id = u.id
        LEFT JOIN
        recipes r ON sr.recipe_id = r.id
        LEFT JOIN
        nutritional_value nv ON r.id = nv.recipe_id
        LEFT JOIN
        ingredients i ON r.id = i.recipe_id
        LEFT JOIN
        procedures rp ON r.id = rp.recipe_id
        WHERE
        sr.user_id = $userId
        GROUP BY
        sr.id";
            

$result = $con->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $recipe = array(
            "id" => $row["id"],
            "user_id" => $row["user_id"],
            "recipe_id" => $row["recipe_id"],
            "recipe_image" => $row["recipe_image"],
            "recipe_name" => $row["recipe_name"]
        );
        $savedRecipes[] = $recipe;
    }
    header('Content-Type: application/json');
    echo json_encode($savedRecipes);
} else {
    header('Content-Type: application/json');
    echo json_encode(array("message" => "No recipes found"));
}

$con->close();
?>