let currentRecipesData = [];
const Recipes = async  () => {

    try {
        const response = await fetch('./database/fetch_recipe.php');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const recipesData = await response.json();

        if (recipesData.message === "No recipes found") {
            return `
                <a href="addrecipe" id="addRecipeBtn" class="btn btn-primary">Add Recipe</a>
                <div class="container mt-3">
                    <p>No recipes available.</p>
                </div>
            `;
        }

        const recipeCards = generateRecipeCards(recipesData);

        $(document).ready(function() {
            $('.row.recipes-container').on('click', '.expand-content', function () {
                const content = $(this).next('.more-content');
                content.slideToggle('slow');

                const caret = $(this).find('i');
                if (caret.hasClass('fa-square-caret-down')) {
                    caret.removeClass('fa-square-caret-down').addClass('fa-square-caret-up');
                } else {
                    caret.removeClass('fa-square-caret-up').addClass('fa-square-caret-down');
                }
            });

            $('#searchInput').on('input', function () {
                const query = $(this).val().toLowerCase().trim();
                applySearchFilter(query, recipesData);
            });


            $('.row.recipes-container').on('click', '.delete-recipe', function (event) {
                event.preventDefault();
                const currentCard = $(this).closest('.card');
                const recipeId = $(this).data('recipe-id');

                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                });
    
                swalWithBootstrapButtons.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: "./database/delete_recipe.php",
                            data: {
                                id: recipeId
                            },
                            type: "post",
                            success: function (data) {
                                if (data == 'success') {
                                    swalWithBootstrapButtons.fire(
                                        'Deleted!',
                                        'Recipe has been deleted',
                                        'success'
                                    )
                                    if ($('.card').length === 1) {
                                        $('.container').html(`
                                            <p>No recipes available.</p>
                                        `);
                                    } else {
                                        currentCard.fadeOut('slow', function() {
                                            $(this).remove();
                                            refreshRecipes();
                                        });
                                    }
                                } else {
                                    swalWithBootstrapButtons.fire(
                                        'Abort',
                                        'Database Error',
                                        'error'
                                    )
                                    return;
                                }
                            }
                        });
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        swalWithBootstrapButtons.fire(
                            'Cancelled',
                            'Recipe not deleted',
                            'error'
                        )
                    }
                });
            })
        });

        return `
            <div class="row">
                <div class="col">
                    <div class="d-flex mt-3 mb-3">
                        <a href="addrecipe" id="addRecipeBtn" class="btn btn-primary add-button">Add Recipe</a>
                    </div>
                </div>
                <div class="col">
                    <div class="d-flex justify-content-end mt-3 mb-3">
                        <input type="text" id="searchInput" class="form-control me-2" placeholder="Search recipes..." aria-label="Search">
                    </div>
                </div>
            </div>
            <div class="row recipes-container">
                ${recipeCards}
            </div>
        `;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return Swal.fire(
            'Error!',
            'Something Went Wrong!',
            'error'
        )
    }
}

const refreshRecipes = async () => {
    try {
        const response = await fetch('./database/fetch_recipe.php');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const recipesData = await response.json();

        const recipeCards = generateRecipeCards(recipesData);

        $('.row.recipes-container').html(recipeCards);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        $('.row.recipes-container').html(`<p class="text-center mt-5">An error occurred</p>`);
    }
};

const generateRecipeCards = (recipesData) => {
    let recipeCards = '';
    let count = 0;

    recipesData.forEach((recipe, index) => {
        if (count === 0) {
            recipeCards += '<div class="row">';
        }

        recipeCards += `
            <div class="col-lg-3 mb-4">
                <div class="card">
                    <div style="height: 300px; overflow: hidden;">
                        <img src="${recipe.recipeImage}" class="card-img-top" alt="${recipe.recipeName}" style="object-fit: cover; height: 100%;">
                    </div>
                    <div class="card-body" style="height: 150px; overflow: hidden;">
                        <h5 class="card-title">${recipe.recipeName}</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item custom-li-border"><h6>Ingredients</h6>
                            <span class="expand-content more-ingredient"><i class="fa-regular fa-square-caret-down"></i></span>
                            <div class="more-content">
                                ${formatIngredients(recipe.ingredients)}
                            </div>
                        </li>
                        <li class="list-group-item custom-li-border"><h6>Procedures</h6>
                            <span class="expand-content more-procedure"><i class="fa-regular fa-square-caret-down"></i></span>
                            <div class="more-content">
                                ${formatInstructions(recipe.procedures)}
                            </div>
                        </li>
                        <li class="list-group-item custom-li-border"><h6>Nutritional value</h6>
                            <span class="expand-content more-nutritional"><i class="fa-regular fa-square-caret-down"></i></span>
                            <div class="more-content">
                                Calories: ${recipe.calories} <br> Fat: ${recipe.fat} <br> Protein: ${recipe.protein} <br> Carbs: ${recipe.carbs}
                            <div>
                        </li>
                        <li class="list-group-item custom-li-border">
                            <!-- <a href="editrecipe" class="btn btn-secondary edit-recipe" data-recipe-id="${recipe.id}">Edit</a> -->
                            <a href="" class="btn btn-danger delete-recipe" data-recipe-id="${recipe.id}">Delete</a>
                        </li>
                    </ul>
                </div>
            </div>`;

        count++;

        if (count === 4 || index === recipesData.length - 1) {
            recipeCards += '</div>';
            count = 0;
        }
    });

    return recipeCards;
};

const applySearchFilter = async (query, recipesData) => {
    try {
        const filteredRecipes = recipesData.filter(recipe => {
            return (
                recipe.recipeName.toLowerCase().includes(query) ||
                recipe.ingredients.toLowerCase().includes(query)
            );
            
        });

        await new Promise(resolve => setTimeout(resolve, 500));

        if (!arraysAreEqual(filteredRecipes, currentRecipesData)) {
            const recipeContainer = $('.row.recipes-container');
            const loadingIndicator = `
                <div class="d-flex justify-content-center align-items-center" style="height: 80vh;">
                    <div class="text-center">
                        <i class="fa fa-spinner fa-spin fa-5x"></i>
                        <p class="mt-3">Loading...</p>
                    </div>
                </div>
            `;

            recipeContainer.html(loadingIndicator);

            if (filteredRecipes.length === 0) {
                recipeContainer.html(`<p class="text-center mt-5">No results found</p>`);
            } else {
                const newRecipeCards = generateRecipeCards(filteredRecipes);
                const currentCards = recipeContainer.children();

                currentCards.fadeOut('slow', function () {
                    recipeContainer.html(newRecipeCards);
                    recipeContainer.find('.col-lg-3').hide().fadeIn('slow');
                });
            }
            currentRecipesData = filteredRecipes;
        }
    } catch (error) {
        console.error('Error applying search filter:', error);
        recipeContainer.html(`<p class="text-center mt-5">An error occurred</p>`);
    }
};

const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
};

const formatIngredients = (ingredients) => {
    const formattedInstructions = ingredients.split('| ').map((ingredient, index) => {
        return `<div>${ingredient}</div>`;
    }).join('');
    return formattedInstructions;
}

const formatInstructions = (instructions) => {
    const formattedInstructions = instructions.split('| ').map((instruction, index) => {
        return `<div><strong>STEP ${index + 1}:</strong> ${instruction}</div>`;
    }).join('');
    return formattedInstructions;
}

export default Recipes;