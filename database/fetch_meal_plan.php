<?php
    session_start();
    include('connection.php');

    $sql = "SELECT
            mp.id, mp.recipe_id,
            mp.meal_description,
            mp.date,
            u.id AS user_id,
            r.name AS recipe_name, r.image_path AS recipe_image,
            GROUP_CONCAT(DISTINCT i.name SEPARATOR '| ') AS ingredients,
            GROUP_CONCAT(DISTINCT rp.name ORDER BY rp.step_number ASC SEPARATOR '| ') AS procedures
        FROM
            meal_plans mp
        LEFT JOIN
            users u ON mp.user_id = u.id
        LEFT JOIN
            recipes r ON mp.recipe_id = r.id
        LEFT JOIN
            nutritional_value nv ON r.id = nv.recipe_id
        LEFT JOIN
            ingredients i ON r.id = i.recipe_id
        LEFT JOIN
            procedures rp ON r.id = rp.recipe_id
        GROUP BY
            mp.id";
    $result = $con->query($sql);
    
    if ($result->num_rows > 0) {
        $mealPlanData = array();
        while($row = $result->fetch_assoc()) {
            $mealPlanData[] = $row;
        }
        header('Content-Type: application/json');
        echo json_encode($mealPlanData);
    } else {
        echo json_encode(array("message" => "0 results"));
    }
    $con->close();
?>