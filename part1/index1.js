
 const apiKey = "8d0ec463e4ef41edaa41afe2bc6893f3";

// const kk = "https://api.spoonacular.com/recipes/complexSearch";

const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=5`;
const button = document.getElementById("search_btn");
let receip_list = document.getElementById("receip_list");
let receip_empty = document.getElementById("receip_empty");
let fav = document.getElementById("fav");
let data = [];
let sorted_arr = [];
let recipeId = "";
let fav_arr = JSON.parse(localStorage.getItem('favArray')) ==null ? []: JSON.parse(localStorage.getItem('favArray'));
let ind_page = document.getElementById("ind_page");
let nav_list = document.getElementById("nav_list");
const search_suggests = document.getElementById("search_suggests");
const search_input = document.getElementById("search_input_in");
const recipes_page = document.getElementById("recipes");
const fav_page = document.getElementById("fav_page");
let fav_empty = document.getElementById("favorites_empty");
search_input.addEventListener("input", (e) =>{
    let val = e.target.value;
        if(val != ""){
        sorted_arr = data.filter(el =>{
            return el.title.toLocaleLowerCase().includes(val.toLocaleLowerCase());
        })
        search_suggests.classList.remove("none")   
    }
    
    if(sorted_arr.length === 0){
        search_suggests.classList.add("none")
    }
     
    search_suggests.innerHTML = "" ;
    for(let i = 0; i < sorted_arr.length; i++){
        const suggestionDiv = document.createElement("div");
        suggestionDiv.classList.add("search_suggest");
        suggestionDiv.innerHTML = sorted_arr[i].title;
        search_suggests.appendChild(suggestionDiv);
    }    
});



fav.addEventListener("click", () =>{
    recipes_page.classList.add("none");
});

fav_page.addEventListener("click", (event) =>{
    let element = event.target;
    if(element.id == "fav_del"){
        let parent = element.parentElement;
        fav_arr = fav_arr.filter(f => f != parent.id);
    }
    localStorage.setItem('favArray', JSON.stringify(fav_arr));

    fetchFavorites();
})



receip_list.addEventListener("click", async(event) => {
    const element = event.target; 
    const elementId = element.closest("[id]").id;
    
    if(elementId != "receip_list"){
        recipeId = elementId;
    }
    await fetchIndPage();
});


ind_page.addEventListener("click", (event)=>{
    const element = event.target; 
    const elementParent = element.closest("[id]");    
    if(elementParent.id == "back_btn"){
        recipes_page.classList.remove("none");
        ind_page.classList.add("none");
    }
    if(elementParent.id == "receip_fav"){  
        if(!fav_arr.includes(recipeId)){
            fav_arr.push(recipeId);
            elementParent.childNodes[1].src = "../assets/icons8-star-active.png";
            elementParent.classList.add("active_fav");
        }else{
            fav_arr = fav_arr.filter(f => f != recipeId);
            elementParent.childNodes[1].src = "../assets/icons8-star-50.png";
            elementParent.classList.remove("active_fav");
        }
        localStorage.setItem('favArray', JSON.stringify(fav_arr));
    }
}) 

nav_list.addEventListener("click", (event) =>{
    const element = event.target; 
    if(element.id == "fav"){
        fetchFavorites();
        recipes_page.classList.add("none");
        ind_page.classList.add("none");
        fav_page.classList.remove("none");

    }else if(element.id == "home"){
        recipes_page.classList.remove("none");
        ind_page.classList.add("none");
        fav_page.classList.add("none");
    }
})





const addElements = () =>{
    receip_list.innerHTML = "";
    if(sorted_arr.length == 0)  
        receip_empty.style.display = "flex" ;
    else
        receip_empty.style.display = "none";
    sorted_arr.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.id = recipe.id;
        recipeItem.classList.add('receip_item');

        const recipeImg = document.createElement('div');
        recipeImg.classList.add('receip_img');
        const img = document.createElement('img');
        img.src = recipe.image;
        recipeImg.appendChild(img);

        const recipeInfo = document.createElement('div');
        recipeInfo.classList.add('receip_info');

        
        const recipeTime = document.createElement('div');
        recipeTime.classList.add('receip_time');
        const timeText = document.createElement('div');
        timeText.classList.add('receip_time_text');
        timeText.textContent = 'Time to cook:';
        const time = document.createElement('div');
        time.classList.add('time');
        time.textContent = "22:00";
        recipeTime.appendChild(timeText);
        recipeTime.appendChild(time);

        const recipeShortInfo = document.createElement('div');
        recipeShortInfo.classList.add('receip_short_info');
        recipeShortInfo.textContent = recipe.title;

        recipeInfo.appendChild(recipeTime);
        recipeInfo.appendChild(recipeShortInfo);
        recipeItem.appendChild(recipeImg);
        recipeItem.appendChild(recipeInfo);

        receip_list.appendChild(recipeItem);
    });

}

const fetchReceips = async() =>{
    const response = await fetch(apiUrl);
    data = await response.json();
    data = data.results;
    console.log(data);
    
    await addElements();
    
}


button.addEventListener("click", () => {
    search_suggests.classList.add("none")
    addElements();
});



console.log(receip_list.childNodes);



fetchReceips();



const fetchIndPage = async() =>{
    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}&includeNutrition=true`)
    .then(response => response.json())
    .then(data => {
    const imageUrl = data.image;
    const title = data.title;
    const instructions = data.instructions;
    const nutrition = data.nutrition.nutrients;
    const ingredients = data.extendedIngredients;

    const recipeSection = document.querySelector('.individual_page');

    recipeSection.innerHTML = `
        <button class="back" id = "back_btn">
                <img src="../assets/icons8-back-50.png" alt="">
               </button>
        <div class="first">
            <div class="ind_receip_img">
                <img src="${imageUrl}" alt="${title}">
            </div>
            <div class="ind_receip_info">
                <div class="ind_receip_title">${title}</div>
                <div class="ind_receip_instructions">${instructions}</div>
                <div class="ind_receip_kall">
                    <div class="kall_text">
                        <div class="kall_tit">Calories:</div>
                        <div class="kall_inf">${nutrition.find(n => n.name === "Calories")?.amount || 0}</div>
                    </div>
                    <div class="kall_text">
                        <div class="kall_tit">Protein:</div>
                        <div class="kall_inf">${nutrition.find(n => n.name === "Protein")?.amount || 0} g</div>
                    </div>
                    <div class="kall_text">
                        <div class="kall_tit">Fat:</div>
                        <div class="kall_inf">${nutrition.find(n => n.name === "Fat")?.amount || 0} g</div>
                    </div>
                </div>
                <div class="ind_receip_fav ${fav_arr.includes(recipeId)?"active_fav":""}" id="receip_fav">
                    <img src="${fav_arr.includes(recipeId)?"../assets/icons8-star-active.png":"../assets/icons8-star-50.png"}" alt="Favorite">
                </div>
            </div>
        </div>
        <div class="ingredients">
         <div class = "ingredients_title">Ingrediets:</div>
            <nav class="nav_list">
                ${ingredients.map(ingredient => `<li>${ingredient.amount} ${ingredient.unit} ${ingredient.name}</li>`).join('')}
            </nav>
        </div>
    `;
}).then(data => {
    recipes_page.classList.add("none");
    ind_page.classList.remove("none");
}
)
.catch(error => console.error("Ошибка при получении информации о рецепте:", error));
}



const fetchFavorites = async() =>{   

    if(fav_arr.length == 0){
        fav_empty.style.display = "flex";
    }else{
        fav_empty.style.display = "none";
    }

    let sorted_fav_arr = data.filter(d => {
        return fav_arr.includes(d.id + "");
    });
        
    let fav_list = document.getElementById("fav_list");
    let str = "";
    sorted_fav_arr.forEach(el => {
        str += `
            <div class="favorites_item" id = "${el.id}">
                <div class="fav_delete" id = "fav_del">
                    <img src="../assets/icons8-x-48.png" alt="">
                </div>
                <div class="receip_img">
                    <img src="${el.image}" alt="">
                </div>
                <div class="receip_info">
                    <div class="receip_time">
                        <div class="receip_time_text">time to cook:</div>
                        <div class="time">22:00</div>
                    </div>
                    <div class="receip_short_info">
                    ${el.title}
                    </div>
                </div>
            </div>
            
            `
    });
    fav_list.innerHTML = str;
}
