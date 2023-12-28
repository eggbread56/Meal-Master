<?php
    session_start();
?>
<html>
    <head>
        <title>Meal Master</title>
        <link rel="stylesheet" href="css/poppinsFont.css">
        <link rel="stylesheet" href="css/font-awesome/css/all.min.css">
        <link rel="stylesheet" href="css/sweetalert.min.css">
        <link rel="stylesheet" href="css/loginStyle.css">
    </head>
    <body>
        <div class="background">
            <div class="form-box">
                <div class="button-box">
                    <div id="switchBtn"></div>
                    <button id="login-switch" type="button" class="toggle-btn">Log In</button>
                    <button id="register-switch" type="button" class="toggle-btn">Register</button>
                </div>
                <div class="header-section">
                    <h2>Welcome to Meal Master</h2>
                    <p>Crafting Culinary Delights Tailored Just for You!</p>
                </div>
                <form id="login" class="input-group">
                    <div style="width:100%;margin:auto;"><img style="position: relative;left: 90;" src="./images/meal_master_logo.png" width="100"></div>
                    <input type="email" id="logEmailField" name="email" class="input-field" placeholder="Enter Email" required>
                    <input type="password" id="logPasswordField" name="password" class="input-field" placeholder="Enter Password" required>
                    <button id="loginBtn" type="submit" class="login-submit">Log in</button>
                </form>
                <form id="register" class="input-group">
                    <input type="text" id="regNameField" class="input-field" placeholder="Enter Name" required>
                    <input type="email" id="regEmailField" class="input-field" placeholder="Enter Email" required>
                    <input type="password" id="regPasswordField" class="input-field" placeholder="Enter Password" required>
                    <input type="password" id="regConfirmPasswordField" class="input-field" placeholder="Confirm Password" required>
                    <button type="submit" class="login-submit">Register</button>
                </form>
                <form id="moreInfo" class="input-group">
                    <div class="switch-container">
                        <div class="switch-column">
                            <label class="switch">
                                <input type="checkbox" id="healthSwitch">
                                <span class="slider round"></span>
                            </label>
                            <span id="healthLabel" class="label-text">Heart Disease</span>
                        </div>
                        <div class="switch-column">
                            <label class="switch">
                                <input type="checkbox" id="diabetesSwitch">
                                <span class="slider round"></span>
                            </label>
                            <span id="diabetesLabel" class="label-text">Diabetes</span>
                        </div>
                    </div>
                    <div class="switch-container">
                        <div class="switch-column">
                            <label class="switch">
                                <input type="checkbox" id="hypertensionSwitch">
                                <span class="slider round"></span>
                            </label>
                            <span id="hypertensionLabel" class="label-text">Hypertension</span>
                        </div>
                    </div>
                    <div class="switch-container">
                        <div class="switch-column">
                            <label class="switch">
                                <input type="checkbox" id="fishAllergySwitch">
                                <span class="slider round"></span>
                            </label>
                            <span id="fishAllergyLabel" class="label-text">Fish Allergy</span>
                        </div>
                        <div class="switch-column">
                            <label class="switch">
                                <input type="checkbox" id="poultryAllergySwitch">
                                <span class="slider round"></span>
                            </label>
                            <span id="poultryAllergyLabel" class="label-text">Poultry Allergy</span>
                        </div>
                    </div>
                    <div class="switch-container">
                        <div class="switch-column">
                            <label class="switch">
                                <input type="checkbox" id="dairyAllergySwitch">
                                <span class="slider round"></span>
                            </label>
                            <span id="dairyAllergyLabel" class="label-text">Dairy Allergy</span>
                        </div>
                        <div class="switch-column">
                            <label class="switch">
                                <input type="checkbox" id="nutAllergySwitch">
                                <span class="slider round"></span>
                            </label>
                            <span id="nutAllergyLabel" class="label-text">Nut Allergy</span>
                        </div>
                    </div>
                    <button type="submit" id="backBtn" class="login-submit">Back</button>
                    <button type="submit" class="login-submit">Submit</button>
                </form>
            </div>
        </div>
        <script src="js/jquery.min.js"></script>
        <script src="js/popper.js"></script>
        <script src="js/sweetalert.min.js"></script>
        <script>
            const loginContainer = document.getElementById('login')
            const registerContainer = document.getElementById('register')
            const moreInfoContainer = document.getElementById('moreInfo')
            
            const switchBtn = document.getElementById('switchBtn')
            const loginSwitch = document.getElementById('login-switch')
            const registerSwitch = document.getElementById('register-switch')

            const navigateTo = (url) => {
                window.location.href = url;
            };

            const getUserRole = async () => {
                try {
                    const response = await fetch('./database/fetch_session.php');
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                        }
                        return await response.json();
                } catch (error) {
                    console.error('There was a problem with the fetch operation:', error);
                    return `<div class="container mt-3"><p>Something went wrong in the connection with the database.</p></div>`;
                }
            };

            const handleInitialRoute = (userRole) => {
                if (userRole === 'user') {
                    navigateTo('/meal-master/home');
                } else if (userRole === 'admin') {
                    navigateTo('/meal-master/users');
                } else {
                    navigateTo('/meal-master/home');
                }
            };

            const handleLogin = async () => {
                const userRole = await getUserRole();
                handleInitialRoute(userRole.user_role);
            };


            $(document).on("click","#login-switch", function () {
                loginContainer.style.left = "50px";
                registerContainer.style.left = "450px";
                moreInfoContainer.style.left = "450px";
                switchBtn.style.left = "0px";
                loginSwitch.style.color = "#fff";
                registerSwitch.style.color = "#c06037";
                $('#regEmailField').val('');
                $('#regPasswordField').val('');
                $('#regConfirmPasswordField').val('');
            })

            $(document).on("click","#register-switch", function () {
                
                loginContainer.style.left = "-400px";
                registerContainer.style.left = "50px";
                switchBtn.style.left = "110px";
                loginSwitch.style.color = "#c06037";
                registerSwitch.style.color = "#fff";
                $('#logEmailField').val('');
                $('#logPasswordField').val('');
            })

            $("#backBtn").on("click", function (e) {
                e.preventDefault();
                registerContainer.style.left = "50px";
                moreInfoContainer.style.left = "450px";

            })

        $("#loginBtn").on("click", function(e) {
            e.preventDefault();
            const formData = $("#login").serialize();
            $.ajax({
                type: "POST",
                url: "./database/login.php",
                data: formData,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                dataType: "json",
                success: function(response) {
                    if (response.status === "success") {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 1000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                            },
                            willClose: (toast) => {
                                handleLogin();
                            }
                        })
                        Toast.fire({
                            icon: 'success',
                            title: 'Login Success!'
                        });
                    } else {
                        Swal.fire(
                            'Error',
                            'Login failed. ' + response.message,
                            'error'
                        )
                    }
                },
                error: function() {
                    Swal.fire(
                        'Error',
                        'An error occurred during the AJAX request.',
                        'error'
                    )
                }
            });
        });

        let gloName = "", gloEmail = "";

        $(document).on('submit', '#register', function (e) {
            e.preventDefault();

            const name = $('#regNameField').val();
            gloName = name;
            const email = $('#regEmailField').val();
            gloEmail = email;
            const password = $('#regPasswordField').val();
            const confirmPassword = $('#regConfirmPasswordField').val();

            if (name != '' && email != '' && password != '' && confirmPassword != '') {
                if(password === confirmPassword) {
                    registerContainer.style.left = "-400px";
                    moreInfoContainer.style.left = "50px";
                }else {
                    Swal.fire(
                        'Prompt',
                        'Password do not match!',
                        'warning'
                    )
                }
            }else {
                Swal.fire(
                    'Warning!',
                    'All Fields are required!',
                    'warning'
                )
            }
        });

        $(document).on('submit', '#moreInfo', function (e) {
            e.preventDefault();

            const name = $('#regNameField').val();
            const email = $('#regEmailField').val();
            const password = $('#regPasswordField').val();
            const confirmPassword = $('#regConfirmPasswordField').val();

            const checkedValues = [];

            $(".switch-container input:checked").each(function() {
                const labelText = $(this).closest('.switch-column').find('.label-text').text();
                checkedValues.push(labelText);
            });

            $.ajax({
                    url: "./database/add_user.php",
                    type: "post",
                    data: {
                        name: name,
                        email: email,
                        password: password,
                        checkedValues: checkedValues
                    },
                    success: function (data) {
                        var json = JSON.parse(data);
                        var status = json.status;
                        if (status == 'true') {
                            $('#regNameField').val('');
                            $('#regEmailField').val('');
                            $('#regPasswordField').val('');
                            $('#regConfirmPasswordField').val('');
                            $(".switch-container input").prop("checked", false);
                            const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2500,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                            },
                            willClose: (toast) => {
                            window.location.href = "./home";
                            }
                        })
                        Toast.fire({
                            icon: 'success',
                            title: 'Creating Success! Logging in!'
                        });
                        } else {
                            Swal.fire(
                                'Error',
                                'Database Error',
                                'error'
                            )
                        }
                    }
                });
        })
        </script>
    </body>
</html>