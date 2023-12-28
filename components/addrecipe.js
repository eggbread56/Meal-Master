const AddRecipe = () => {
    $(document).ready(function () {

        let isCaloriesNumeric = false;
        let isFatNumeric = false;
        let isProteinNumeric = false;
        let isCarbsNumeric = false;


        function addProcedureRow() {
            const template = $('.row-template-procedure').clone().removeClass('row-template-procedure').fadeIn(300);
            template.find('.fa-circle-minus').on('click', removeProcedureRow);

            const existingRows = $('.procedure-section .row').length;
            const placeholderText = 'Step ' + (existingRows + 1);
            const name = 'procedure_' + (existingRows + 1);
            template.find('.form-control').attr('placeholder', placeholderText);
            template.find('.form-control').attr('name', name);
            
            $('#numberOfProcedure').val(existingRows + 1)
            $('.procedure-section').append(template);
        }

        function removeProcedureRow() {
            $(this).closest('.row').fadeOut(300, function () {
                $(this).remove();
                updatePlaceholders();
            });
        }

        function updatePlaceholders() {
            $('.procedure-section .row').each(function (index) {
                const placeholderText = 'Step ' + (index + 1);
                const name = 'procedure_' + (index + 1);
                $(this).find('.form-control').attr('placeholder', placeholderText);
                $(this).find('.form-control').attr('name', name);
                
                $('#numberOfProcedure').val(index + 1)
            });
        }

        function addIngredientRow() {
            const template = $('.row-template-ingredient').clone().removeClass('row-template-ingredient').fadeIn(300);
            template.find('.fa-circle-minus').on('click', removeIngredientRow);

            const existingRows = $('.ingredient-section .row').length;
            const placeholderText = 'Ingredient ' + (existingRows + 1);
            const name = 'ingredient_' + (existingRows + 1);
            template.find('.form-control').attr('placeholder', placeholderText);
            template.find('.form-control').attr('name', name);
            $('#numberOfIngredient').val(existingRows + 1)

            $('.ingredient-section').append(template);
        }

        function removeIngredientRow() {
            $(this).closest('.row').fadeOut(300, function () {
                $(this).remove();
                updatePlaceholdersIngredient();
            });
        }

        function updatePlaceholdersIngredient() {
            $('.ingredient-section .row').each(function (index) {
                const placeholderText = 'Ingredient ' + (index + 1);
                const name = 'ingredient_' + (index + 1);
                $(this).find('.form-control').attr('placeholder', placeholderText);
                $(this).find('.form-control').attr('name', name);
                $('#numberOfIngredient').val(index + 1);
            });
        }

        function validateInput(input) {
            input.removeClass('is-valid is-invalid');

            if (input.val().trim() === '') {
                input.addClass('is-invalid');
            } else {
                input.addClass('is-valid');
            }
        }

        function validateNumericInput(input, cat) {
            input.removeClass('is-valid is-invalid');
            if (/^\d+$/.test(input.val()) == true) {
                if(cat == 'calories') {
                    isCaloriesNumeric = true
                }else if(cat == 'fat') {
                    isFatNumeric = true
                }else if(cat == 'protein') {
                    isProteinNumeric = true
                }else if(cat == 'carbs') {  
                    isCarbsNumeric = true
                }
                input.addClass('is-valid');
            } else {
                if(cat == 'calories') {
                    isCaloriesNumeric = false
                }else if(cat == 'fat') {
                    isFatNumeric = false
                }else if(cat == 'protein') {
                    isProteinNumeric = false
                }else if(cat == 'carbs') {  
                    isCarbsNumeric = false
                }
                input.addClass('is-invalid');
            }
        }

        $('.add-row-procedure').on('click', addProcedureRow);
        $('.procedure-section').on('click', '.fa-circle-minus', removeProcedureRow);

        $('.add-row-ingredient').on('click', addIngredientRow);
        $('.ingredient-section').on('click', '.fa-circle-minus', removeIngredientRow);

        $('#addRecipe').on('submit', function (e) {
            e.preventDefault();

            $('.form-control', this).removeClass('is-valid is-invalid');

            $('.form-control', this).each(function () {
                validateInput($(this));
            });

            validateNumericInput($('#floatingCalories'), 'calories');
            validateNumericInput($('#floatingFat'), 'fat');
            validateNumericInput($('#floatingProtein'), 'protein');
            validateNumericInput($('#floatingCarbs'), 'carbs');

            if ($('.is-invalid', this).length === 0) {
                // const formData = $(this).serialize();
                const formData = new FormData(this);
                formData.append('file', $('input[type=file]')[0].files[0]);

                $.ajax({
                    type: "POST",
                    url: "./database/add_recipe.php",
                    data: formData,          
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        const res = jQuery.parseJSON(response);
                        if(res.status == "success") {

                            const swalWithBootstrapButtons = Swal.mixin({
                                customClass: {
                                  confirmButton: 'btn btn-success'
                                },
                                buttonsStyling: false
                              })
                              
                              swalWithBootstrapButtons.fire({
                                title: 'Success!',
                                text: "Recipe added!",
                                icon: 'success',
                                confirmButtonText: 'Ok'
                              }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '/meal-master/recipes';
                                }
                            })
                            
                        }else {
                            Swal.fire(
                                'Error!',
                                'Database Error!',
                                'error'
                            )
                        }
                    },
                    error: function () {
                        Swal.fire(
                            'Error!',
                            'Server Error!',
                            'error'
                        )
                    }
                });
            }else {
                if ((isCaloriesNumeric && isCarbsNumeric && isFatNumeric && isProteinNumeric) == false) {
                    Swal.fire(
                        'Warning!',
                        'Fields for Calories, Fat, Protein and Carbs should be Numeric',
                        'warning'
                    )
                }else {
                    Swal.fire(
                        'Warning!',
                        'All Fields are required!',
                        'warning'
                    )
                }
            }
        });
    });

    return `
    <a href="recipes" id="backRecipeBtn" class="btn btn-primary">Back</a>
    <form id="addRecipe" enctype="multipart/form-data" class="form-floating">
        <div id="dropArea" class="drop-area mt-3">
            <input type="file" name="recipe_image" id="fileInput" accept="image/*" class="form-control" />
            <p class="mt-2">Drag & Drop files here or click to select</p>
        </div>
        <div class="form-floating mb-3">
            <input type="text" name="recipe_name" class="form-control" id="floatingRecipeName" placeholder="">
            <label for="floatingRecipeName">Recipe Name</label>
        </div>
        <div class="procedure-section">
            <div class="row mb-3">
                <label for="inputProcedure" class="col-sm-1 col-form-label">Procedure</label>
                <i class="fa-solid fa-circle-plus extend-icon col-sm-1 add-row-procedure"></i>
                <div class="col-sm-10">
                    <input type="text" class="form-control" name="procedure_1" id="inputProcedure" placeholder="Step 1">
                </div>
            </div>
        </div>
        <div class="ingredient-section">
            <div class="row mb-3">
                <label for="inputIngredients" class="col-sm-1 col-form-label">Ingredients</label>
                <i class="fa-solid fa-circle-plus expand-row extend-icon col-sm-1 add-row-ingredient"></i>
                <div class="col-sm-10">
                    <input type="text" class="form-control" name="ingredient_1" id="inputIngredients" placeholder="Ingredient 1" required>
                </div>
            </div>
        </div>
        <div class="form-floating mb-3">
            <input type="text" name="calories" class="form-control" id="floatingCalories" placeholder="">
            <label for="floatingCalories">Calories</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" name="fat" class="form-control" id="floatingFat" placeholder="">
            <label for="floatingFat">Fat</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" name="carbs" class="form-control" id="floatingCarbs" placeholder="">
            <label for="floatingCarbs">Carbs</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" name="protein" class="form-control" id="floatingProtein" placeholder="">
            <label for="floatingProtein">Protein</label>
        </div>
        <input type="hidden" name="numberOfProcedure" id="numberOfProcedure" value="1">
        <input type="hidden" name="numberOfIngredient" id="numberOfIngredient" value="1">
        <button type="submit" class="btn btn-primary mt-3">Add Recipe</button>
    </form>


    <div class="row-template-procedure" style="display: none;">
        <div class="row mb-3">
            <label for="inputProcedure" class="col-sm-1 col-form-label"></label>
            <i class="fa-solid fa-circle-minus col-sm-1 minus-row-procedure"></i>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="inputProcedure">
            </div>
        </div>
    </div>

    <div class="row-template-ingredient" style="display: none;">
        <div class="row mb-3">
            <label for="inputingredient" class="col-sm-1 col-form-label"></label>
            <i class="fa-solid fa-circle-minus col-sm-1 minus-row-ingredient"></i>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="inputIngredient">
            </div>
        </div>
    </div>
    `;
}

export default AddRecipe;