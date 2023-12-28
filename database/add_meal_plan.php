<?php 
session_start();
include('connection.php');

if (isset($_POST["breakfast"]) && isset($_POST["lunch"]) && isset($_POST["dinner"]) && isset($_POST["date"])) {
    $user_id = $_SESSION['id'];
    $date = $_POST["date"];
    $breakfast_id = $_POST["breakfast"];
    $lunch_id = $_POST["lunch"];
    $dinner_id = $_POST["dinner"];

    $counter = 0;
    
    $sql = "SELECT * from meal_plans WHERE meal_description = 'breakfast' AND user_id = $user_id AND date = '$date'";
    $result = $con->query($sql);
    
    if ($result->num_rows > 0) {
        
        $row = $result->fetch_assoc();
        $meal_plan_id = $row['id'];
        if($row['recipe_id'] != $breakfast_id) {
            $delSql = "DELETE FROM meal_plans WHERE id=$meal_plan_id";
            $delQuery = mysqli_query($con,$delSql);
            if($delQuery) {
                $counter++;
                $insSql = "INSERT INTO `meal_plans` (`user_id`, `recipe_id`, `meal_description`, `date`) VALUES ($user_id, $breakfast_id, 'breakfast', '$date')";
                mysqli_query($con,$insSql);
            }
        }
    }else {
        $counter++;
        $insSql = "INSERT INTO `meal_plans` (`user_id`, `recipe_id`, `meal_description`, `date`) VALUES ($user_id, $breakfast_id, 'breakfast', '$date')";
        mysqli_query($con,$insSql);
    }

    $sql = "SELECT * from meal_plans WHERE meal_description = 'lunch' AND user_id = $user_id AND date = '$date'";
    $result = $con->query($sql);
    
    if ($result->num_rows > 0) {
        
        $row = $result->fetch_assoc();
        $meal_plan_id = $row['id'];
        if($row['recipe_id'] != $lunch_id) {
            $delSql = "DELETE FROM meal_plans WHERE id=$meal_plan_id";
            $delQuery = mysqli_query($con,$delSql);
            if($delQuery) {
                $counter++;
                $insSql = "INSERT INTO `meal_plans` (`user_id`, `recipe_id`, `meal_description`, `date`) VALUES ($user_id, $lunch_id, 'lunch', '$date')";
                mysqli_query($con,$insSql);
            }
        }
    }else {
        $counter++;
        $insSql = "INSERT INTO `meal_plans` (`user_id`, `recipe_id`, `meal_description`, `date`) VALUES ($user_id, $lunch_id, 'lunch', '$date')";
        mysqli_query($con,$insSql);
    }

    $sql = "SELECT * from meal_plans WHERE meal_description = 'dinner' AND user_id = $user_id AND date = '$date'";
    $result = $con->query($sql);
    
    if ($result->num_rows > 0) {
        
        $row = $result->fetch_assoc();
        $meal_plan_id = $row['id'];
        if($row['recipe_id'] != $dinner_id) {
            $delSql = "DELETE FROM meal_plans WHERE id=$meal_plan_id";
            $delQuery = mysqli_query($con,$delSql);
            if($delQuery) {
                $counter++;
                $insSql = "INSERT INTO `meal_plans` (`user_id`, `recipe_id`, `meal_description`, `date`) VALUES ($user_id, $dinner_id, 'dinner', '$date')";
                mysqli_query($con,$insSql);
            }
        }
    }else {
        $counter++;
        $insSql = "INSERT INTO `meal_plans` (`user_id`, `recipe_id`, `meal_description`, `date`) VALUES ($user_id, $dinner_id, 'dinner', '$date')";
        mysqli_query($con,$insSql);
    }

    if($counter == 0) {
        echo 'No Changes';
    }else {
        echo 'Updated';
    }
}

?>