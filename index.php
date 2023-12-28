<?php
session_start();
include('./database/authenticate.php');
?>
<html lang="en">
  <head>
  	<title>Meal Master</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="stylesheet" href="css/poppinsFont.css">
	<link rel="stylesheet" href="css/font-awesome/css/all.min.css">
	<link rel="stylesheet" href="css/sweetalert.min.css">
	<link rel="stylesheet" href="css/bootstrap5.min.css">
	<link rel="stylesheet" href="js/datatables/datatables.min.css">
	<link rel="stylesheet" href="css/style.css">
	<link rel="stylesheet" href="css/extra.css">
  </head>
  <body>
		
		<div class="wrapper d-flex align-items-stretch">
			<nav id="sidebar">	
				<div class="custom-menu">
					<button type="button" id="sidebarCollapse" class="btn btn-primary">
	          <i class="fa fa-bars"></i>
	          <span class="sr-only">Toggle Menu</span>
	        </button>
        </div>
		<div class="p-4 sidebar-wrapper">
			<h1><a href="./home" class="logo">Meal Master <span>Master Planning Meals</span></a></h1>
	        <ul class="list-unstyled components mb-5">
			<?php if ($_SESSION['role'] === 'user') { ?>
	          <li>
	            <a href="/meal-master/home" class="menus"><span class="fa fa-home mr-3"></span> Home</a>
	          </li>
			<?php }?>
			<?php if ($_SESSION['role'] === 'admin') { ?>
	          <li>
	              <a href="/meal-master/users" class="menus"><span class="fa fa-user mr-3"></span> Users</a>
	          </li>
			<?php }?>
			<?php if ($_SESSION['role'] === 'admin') { ?>
	          <li>
              <a href="/meal-master/recipes" class="menus"><span class="fa-solid fa-burger mr-3"></span> Recipes</a>
	          </li>
			<?php }?>
			<?php if ($_SESSION['role'] === 'user') { ?>
	          <li>
              <a href="/meal-master/planner" class="menus"><span class="fa-solid fa-calendar-check mr-3"></span> Planner</a>
	          </li>
			<?php }?>
			  <li>
				<a href="logout" class="menus"><span class="fa-solid fa-right-from-bracket mr-3"></span> Log out</a>
			</li>
	        </ul>

	        <div class="footer">
	        	<p>
					Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This WEB APP is property of MEAL MASTER GROUP
				</p>
	        </div>

	      </div>
    	</nav>
      <div id="app" class="p-4 p-md-5 pt-5">
      </div>
	  <!-- <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Toggle right offcanvas</button> -->

            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
              
            </div>
		</div>
    <script src="js/jquery.min.js"></script>
    <script src="js/popper.js"></script>
    <script src="js/bootstrap.min.js"></script>
	<script src="js/bootstrap5.min.js"></script>
    <script src="js/main.js"></script>
	<script src="js/datatables/datatables.min.js"></script>
	<script type="module" src="js/router.js"></script>
	<script src="js/sweetalert.min.js"></script>
	<script src="js/fullcalendar-6.1.9/dist/index.global.min.js"></script>
	<script>
		
	</script>
  </body>
</html>