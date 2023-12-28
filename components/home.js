let filteredRecipes = [];


const fetchSavedRecipes = async () => {
  try {
    const response = await fetch('./database/fetch_saved_recipe.php');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    return [];
  }
};
const saveRecipe = async (recipeId) => {
  try {
    const response = await fetch('./database/save_recipe.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipeId: recipeId
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Succeed!",
      text: "Saved to Favorite Recipes!",
      icon: "success"
    });
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
};

const unsaveRecipe = async (recipeId) => {
  try {
    const response = await fetch('./database/unsave_recipe.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipeId }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
  } catch (error) {
    console.error('Error unsaving recipe:', error);
  }
};

const openModal = (recipe) => {
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  modalTitle.textContent = recipe.recipeName;
  const ingredientsList = recipe.ingredients.split('|').map(ingredient => `<li>${ingredient.trim()}</li>`).join('');
  const proceduresList = recipe.procedures.split('|').map((step, index) => `<p><strong>Step ${index + 1}: </strong>${step.trim()}</p>`).join('');

  modalBody.innerHTML = `
    <h6>Nutritional Values:</h6>
    <ul>
      <li>Carbs: ${recipe.carbs}</li>
      <li>Fat: ${recipe.fat}</li>
      <li>Protein: ${recipe.protein}</li>
      <li>Calories: ${recipe.calories}</li>
    </ul>

    <h6>Ingredients:</h6>
    <ul>${ingredientsList}</ul>

    <h6>Procedure:</h6>
    ${proceduresList}
  `;
  const myModal = new bootstrap.Modal(document.getElementById('recipeModal'));
  myModal.show();
};

const fetchRecipes = async () => {
  const response = await fetch('./database/fetch_recipe.php');
  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }
  return response.json();
};

const fetchUser = async () => {
  const responseUser = await fetch('./database/fetch_user_by_ID.php');
  if (!responseUser.ok) {
    throw new Error('Network response was not ok.');
  }
  return responseUser.json();
};

const filterRecipesByCondition = (recipes, condition, filters) => {
  if (condition.includes('Allergy')) {
    const conditionFilters = filters[condition] || [];
    conditionFilters.forEach(filter => {
      recipes = recipes.filter(recipe => !recipe.ingredients.toLowerCase().includes(filter.toLowerCase()));
    });
  } else if (condition === "Hypertension" || condition === "Heart Disease" || condition === "Diabetes") {
    recipes = recipes.filter(recipe => {
      const { carbs, fat, protein, calories } = recipe;
      return (
        (condition === "Hypertension" && carbs < 325 && fat < 78 && protein < 175 && calories < 700) ||
        (condition === "Heart Disease" && carbs < 75 && fat < 40 && protein < 77 && calories < 700) ||
        (condition === "Diabetes" && carbs < 325 && fat < 175 && protein < 78 && calories < 700)
      );
    });
  }
  return recipes;
};

const getRecommendedRecipes = async () => {
  try {
    const recipesData = await fetchRecipes();
    const userDataArray = await fetchUser();
    const savedRecipes = await fetchSavedRecipes();
    const userData = userDataArray[0];

    const userHealthConditions = userData.health_conditions.split(', ').map(condition => condition.trim());

    const healthConditionsFilters = {
      'Fish Allergy': ["Salmon","Tuna","Cod","Tilapia","Trout","Haddock","Mackerel","Sardines","Anchovies","Mahi-mahi","Halibut","Catfish","Swordfish","Bass","Perch","Snapper","Flounder","Carp","Eel","Sole","Smelt","Pike","Whitefish","Butterfish","Wolffish","Caviar","Roe","Octopus","Squid","Cuttlefish","Scallops","Shrimp","Prawns","Lobster","Crab","Crawfish","Clams","Mussels","Oysters","Abalone","Jellyfish","Geoduck","Sea urchin","Conch","Cockles","Limpets","Barnacles","Sea cucumber","Razor clams","Slipper shell","Chiton","Krill","Plankton","Krill oil","Fish sauce","Fish stock","Dashi","Bonito","Fish paste","Fish balls","Fish cakes","Surimi","Fish maw","Fish roe","Fish collagen","Fish meal","Fish oil","Fish skin","Fish bone broth","Fish skin crackers","Fish skin snacks","Fish jerky","Fish floss","Fish flakes","Fish sausage","Fish sticks","Fish fingers","Fish fillet","Fish steak","Fish head","Fish tail","Fish belly","Fish belly strips","Fish gut","Fish liver","Fish eyes","Fish scales","Fish fins","Fish swim bladder","Fish bladder","Fish lips","Fish cheeks","Fish throat","Fish collar","Fish bones","Fish spine","Fish blood","Fish gills","Fish innards","Fish intestines"],
      'Poultry Allergy': ["Chicken","Turkey","Duck","Goose","Quail","Pheasant","Ostrich","Emu","Egg","Hen","Rooster","Broiler","Fowl","Gizzard","Liver","Oviduct","Ovum","Albumen","Yolk","Shell","Eggshell","Egg white","Egg yolk","Scrambled egg","Omelette","Hard-boiled egg","Soft-boiled egg","Fried egg","Poached egg","Deviled egg","Egg salad","Egg custard","Egg wash","Egg noodles","Egg drop soup","Egg roll","Egg foo young","Egg tart","Egg bread","Egg substitute","Egg wash","Eggshell membrane"],
      'Dairy Allergy': ["Milk","Butter","Cheese","Yogurt","Cream","Sour cream","Ice cream","Ghee","Whey","Curd","Cottage cheese","Cream cheese","Mozzarella","Cheddar","Parmesan","Provolone","Swiss cheese","Feta","Ricotta","Goat cheese","Sheep cheese","Buttermilk","Condensed milk","Evaporated milk","Powdered milk","Whipped cream","Whipping cream","Half-and-half","Malted milk","Flavored milk","Almond milk","Soy milk","Coconut milk","Rice milk","Oat milk","Cashew milk","Hemp milk","Macadamia milk","Quark","Kefir","Lassi","Clabber","Casein","Lactose","Lactase","Lactaid","Skim milk","Low-fat milk","Fat-free milk","2% milk","Whole milk","Raw milk","Pasteurized milk","Homogenized milk","UHT milk","Chocolate milk","Strawberry milk","Vanilla milk","Cinnamon milk","Peanut milk","Hazelnut milk","Butterfat","Milk protein","Milk solids","Milk powder","Creamer","Non-dairy creamer"],
      'Nut Allergy': ["Almond","Peanut","Cashew","Walnut","Pistachio","Hazelnut","Macadamia","Brazil nut","Pecan","Coconut","Pine nut","Chestnut","Ginkgo nut","Hickory nut","Butternut","Shea nut","Beech nut","Acorn","Filbert","Chufa","Kola nut","Marcona almond","Monkey nut","Prunus amygdalus dulcis","Groundnut","Mandelonas","Mongongo","Nangai","Cicada nut","Pili nut","Redskin peanut","Sacha inchi","Snickerdoodle nut"],
      'Hypertension': [],
      'Heart Disease': [],
      'Diabetes': []
    };

    filteredRecipes = recipesData;

    userHealthConditions.forEach(condition => {
      if (healthConditionsFilters[condition]) {
        filteredRecipes = filterRecipesByCondition(filteredRecipes, condition, healthConditionsFilters);
      }
    });

    filteredRecipes.forEach(recipe => {
      const isSaved = savedRecipes.some(savedRecipe => savedRecipe.recipe_id == recipe.id && savedRecipe.user_id == userData.id);
      recipe.isSaved = isSaved;
    });
    
    if (recipesData.message === "No recipes found") {
      return `<div class="container mt-3"><p>No recipes available.</p></div>`;
    } else {
      const chunkedRecipes = [];
      for (let i = 0; i < filteredRecipes.length; i += 6) {
        chunkedRecipes.push(filteredRecipes.slice(i, i + 6));
      }

      const carouselItems = chunkedRecipes.map((chunk, index) => `
      <div class="carousel-item${index === 0 ? ' active' : ''}" data-bs-interval="10000">
        <div class="row">
          ${chunk.map(recipe => `
            <div class="col-md-2">
              <div class="card">
                <img src="${recipe.recipeImage}" class="card-img-top" alt="${recipe.recipeName} Image" style="object-fit: cover; height: 200px;">
                <div class="card-body">
                  <h5 class="card-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${recipe.recipeName}</h5>
                  ${recipe.isSaved ?
                    `<span class="position-absolute top-63 start-80 translate-middle badge rounded-pill bg-success save-badge">
                        Saved
                        <span class="visually-hidden">Saved Recipe</span>
                     </span>`
                    : ''}
                  <div class="row">
                      <div class="col-8">
                           <button class="btn btn-primary view-recipe-btn" data-id="${recipe.id}">View</button>
                      </div>
                      <div class="col-4">
                          <div class="d-flex justify-content-end">
                              <button class="btn btn-primary save-recipe-btn" data-id="${recipe.id}">
                                ${recipe.isSaved ? '<i class="fa-regular fa-square-minus"></i>' : '<i class="fas fa-bookmark"></i>'}
                            </button>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

      return `
        <div id="carouselExampleDark" class="carousel carousel-dark slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            ${carouselItems}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      `;
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return `<div class="container mt-3"><p>Something went wrong while fetching recipes.</p></div>`;
  }
};

const getSessionInfo = async () => {
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

const fetchMealPlan = async () => {
  try {
    const response = await fetch('./database/fetch_meal_plan.php');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    return [];
  }
};

const Home = async () => {
  const recommendedContent = await getRecommendedRecipes();
  const user = await getSessionInfo();
  const meal_plan = await fetchMealPlan();

  const today = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const formattedDate = formatter.format(today);
  
  let meals;

  if(meal_plan.message != "0 results") {
      meals = meal_plan.filter(meal => meal.date == formattedDate && meal.user_id == user.id).map((meal) => {
        return `
            <div class="col-md-4">
              <div class="card card_today">
                <img src="${meal.recipe_image}" class="card-img-top card_today-img-top" alt="${meal.recipe_name}">
                <div class="card-body card_today-body">
                  <h5 class="card-title card_today-title">${meal.meal_description.charAt(0).toUpperCase() + meal.meal_description.slice(1)}</h5>
                  <p>${meal.recipe_name}</p>
                </div>
              </div>
            </div>
        `;
      }).join('')
      if(meals.length == 0) {
        meals = `
        <div class="meals-container">
          <div class="center-meals">
            <h5>NO PLANS FOR TODAY</h5>
            <a class="btn btn-success" href="planner">Plan Meal</a>
          </div>
        </div>
        `;
      }
  } else {
    meals = `
    <div class="meals-container">
      <div class="center-meals">
        <h5>NO PLANS FOR TODAY</h5>
        <a class="btn btn-success" href="planner">Plan Meal</a>
      </div>
    </div>
    `;
  }

  $(document).ready(function() {
    document.querySelectorAll('.view-recipe-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        const recipeId = event.target.getAttribute('data-id');
        const recipe = filteredRecipes.find(recipe => recipe.id === recipeId);
        openModal(recipe);
      });
    });

    $(document).on('click', '.save-recipe-btn', async function() {
      const recipeId = $(this).data('id');
      const savedRecipes = await fetchSavedRecipes();
      const isRecipeSaved = savedRecipes.some(savedRecipe => {
        return savedRecipe.recipe_id == recipeId && savedRecipe.user_id == user.id;
    });
      if (isRecipeSaved) {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
          },
          buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
          title: "Are you sure?",
          text: "This recipe seems fine!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, Unsave!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true
        }).then(async (result) => {
          if (result.isConfirmed) {
            await unsaveRecipe(recipeId);
            const recipeCard = $(this).closest('.card-body');
            recipeCard.find('.save-badge').remove();
            $(this).html('<i class="fas fa-bookmark"></i>');
            swalWithBootstrapButtons.fire({
              title: "Unsaved!",
              text: "Removed this recipe in your favorites.",
              icon: "success"
            });
          } else if (
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire({
              title: "Cancelled",
              text: "This recipe is still part of your favorites",
              icon: "error"
            });
          }
        });
      } else {        
          const recipeCard = $(this).closest('.card-body');
          recipeCard.append('<span class="position-absolute top-63 start-80 translate-middle badge rounded-pill bg-success save-badge">Saved<span class="visually-hidden">Saved Recipe</span></span>');       
          await saveRecipe(recipeId);
          $(this).html('<i class="fa-regular fa-square-minus"></i>');
      }
    });
  });

  return `
    <section class="">
      <h5>Hi ${user.name}!</h5>
      <h6>Here's your Meal for the day</h6>
      <div class="row">
        ${meals}
      </div>
    </section>

    <section class="recommended-section mt-5">
      <h5>Recommended Recipes</h5>
      ${recommendedContent}
    </section>

    <div class="modal fade" id="recipeModal" tabindex="-1" aria-labelledby="recipeModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="modalBody">
          </div>
        </div>
      </div>
    </div>
  `;
};

export default Home;