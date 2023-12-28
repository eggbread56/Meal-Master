<?php
session_start();
include('connection.php');

if(isset($_GET['recipe_id'])) {
    $recipe_id = $_POST['recipe_id'];

    $sql = "SELECT r.*, 
            nv.calories, nv.fat, nv.protein, nv.carbs,
            GROUP_CONCAT(DISTINCT i.name SEPARATOR '| ') AS ingredients,
            GROUP_CONCAT(DISTINCT rp.name ORDER BY rp.step_number ASC SEPARATOR '| ') AS procedures
            FROM recipes r
            LEFT JOIN nutritional_value nv ON r.id = nv.recipe_id
            LEFT JOIN ingredients i ON r.id = i.recipe_id
            LEFT JOIN procedures rp ON r.id = rp.recipe_id
            WHERE id = $recipe_id
            GROUP BY r.id
            ORDER BY r.id DESC";

    $result = $con->query($sql);

    $recipes = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $recipe = array(
                "id" => $row["id"],
                "recipeName" => $row["name"],
                "recipeImage" => $row["image_path"],
                "calories" => $row["calories"],
                "fat" => $row["fat"],
                "protein" => $row["protein"],
                "carbs" => $row["carbs"],
                "ingredients" => $row["ingredients"],
                "procedures" => $row["procedures"]
            );
            $recipes[] = $recipe;
        }
        echo json_encode($recipes);
    } else {
        echo json_encode(array("message" => "No recipes found"));
    }
} else {
    echo json_encode(array("message" => "Recipe ID not provided"));
}

$con->close();
?>