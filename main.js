var url=document.getElementById('siteLink');
var nameS=document.getElementById('siteName');
var modalBtn=document.getElementById('modalBtn');
var modal=document.getElementById('modal');
var tbody=document.getElementById('tbody');
var searchInput=document.getElementById('search');




function validURL(value, element) {
    //microsoft url validation
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}
function validName(value) {
    if (!value) {
        return false;
    }
    var namePattern = /^[a-zA-Z][a-zA-Z0-9\s]{1,}[a-zA-Z0-9]$/;
    return namePattern.test(value);
}


function clear(){
    url.value='';
    nameS.value='';
    url.classList.remove("is-valid");
    url.classList.remove("is-invalid");
    nameS.classList.remove("is-valid");
    nameS.classList.remove("is-invalid");
}

modalBtn.addEventListener('click',function(){
    modal.classList.remove('d-block')
})


var sitesArr=[];

if (localStorage.getItem("bookmark")){
    sitesArr = JSON.parse(localStorage.getItem("bookmark"));
    display(sitesArr);
}

function addSite(){
    var site={
        siteName:nameS.value,
        link:url.value,
        favicon: false,
        favAlert:0,
    }
    sitesArr.push(site);
    var datastr=JSON.stringify(sitesArr)
    localStorage.setItem('bookmark',datastr)
    console.log(sitesArr)
}


document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    var urlElement = document.getElementById('siteLink');
    var urlVal = urlElement.value;
    var nameElement = document.getElementById('siteName');
    var nameVal = nameElement.value;
    if (!validURL(urlVal, urlElement) || !validName(nameVal)) {
        event.preventDefault();
        modal.classList.add('d-block');
    }
    else{
        addSite();
        display(sitesArr)
    }
    clear();
});

function display(arr){
    var htmlElement=``;
    for(var i=0;i<arr.length;i++){
        var favClass;
    if (arr[i].favicon) {
        favClass = 'fa-solid';
    } else {
        favClass = 'fa-regular';
    }
        htmlElement+=`
            <tr>
                <th scope="row">${i+1}</th>
                <td>${arr[i].siteName}</td>
                <td><button class="btn btn-visit btn-success" data-index="${i}">
                        <a href='${arr[i].link}' target='_blank'><i class="fa-solid fa-eye pe-2"></i> Visit</a>
                    </button>
                </td>
                <td><button id='deletBtn' class="btn btn-delete pe-2 btn-danger" data-index="${i}">
                        <a><i class="fa-solid fa-trash-can"></i>
                        Delete</a>
                    </button>
                </td>
                <td>
                    <i class="${favClass} fa-regular fa-star addfav" index='${i}'></i>
                </td>
            </tr>`
    }
    tbody.innerHTML=htmlElement;

    var deleteBtns = document.querySelectorAll(".btn-delete");
    deleteBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var index = Number(btn.getAttribute("data-index"));
            deleteBookmark(index);
        });
    });


    var addfavIcons = document.querySelectorAll(".addfav");
    addfavIcons.forEach(function(icon) {
        icon.addEventListener('click', function() {
            var index = Number(icon.getAttribute("index"));
            toggleFavorite(index);
            if (sitesArr[index].favAlert === 0) {
                alert(`If you want to find what you have chosen as a favorite, you can search in the search box using one of the two phrases 'fav' or 'Favorite'.`);
                sitesArr[index].favAlert = 1;
                localStorage.setItem('bookmark', JSON.stringify(sitesArr));
            }
        });
    });


}


function deleteBookmark(index) {
    sitesArr.splice(index, 1);
    localStorage.setItem("bookmark", JSON.stringify(sitesArr));
    display(sitesArr);
}




function validOrIn() {
    var nameVal = nameS.value;
    if(validName(nameVal)){
        nameS.classList.add("is-valid");
        nameS.classList.remove("is-invalid");
    }
    else{
        nameS.classList.remove("is-valid");
        nameS.classList.add("is-invalid");
    }
}

function validOrIn1(){
    var urlVal = url.value;
    if(validURL(urlVal, url)){
        url.classList.add("is-valid");
        url.classList.remove("is-invalid");
    }
    else{
        url.classList.remove("is-valid");
        url.classList.add("is-invalid");
    }
}

nameS.addEventListener('input',validOrIn);
url.addEventListener('input',validOrIn1);


searchInput.oninput= function(){
    var searchVal = searchInput.value.toLowerCase();
    var searchArr=[];
    if (searchVal === "favorite" || searchVal === "fav") {
        for (var i = 0; i < sitesArr.length; i++) {
            if (sitesArr[i].favicon) {
                searchArr.push(sitesArr[i]);
            }
        }
    }
    else{
        for(var i=0;i<sitesArr.length;i++){
            if(sitesArr[i].siteName.toLowerCase().includes(searchInput.value.toLowerCase())){
                searchArr.push(sitesArr[i]);
            }
        }
    }
    display(searchArr);
}




function toggleFavorite(index) {
    sitesArr[index].favicon = !sitesArr[index].favicon;
    localStorage.setItem("bookmark", JSON.stringify(sitesArr));
    display(sitesArr);
}




