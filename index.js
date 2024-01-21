// var form = document.getElementById("myForm")

// form.addEventListener("submit", function (e) {
//     e.preventDefault()

//     var search = document.getElementById("search").value

//     var originalName = search.split(' ').join('')

//     fetch(`https://api.github.com/users/${originalName}`)
//         .then((res) => {
//             if (!res.ok) {
//                 alert("User not found : Please enter the correct user name");
//                 return null
//             }
//             return res.json()
//         })
//         .then((data) => {
//             console.log(data)

//             const avatar = data.avatar_url
//             const name = data.name
//             const bio = data.bio
//             const location = data.location
//             const email = data.email
//             const reposs = data.repos_url


//             document.getElementById("result").innerHTML = `
//         <img src ="${avatar}" style="max-width: 100%; height: 100%; border-radius:5px;"/>`
//             document.getElementById("name").innerHTML = `
//         <div>${name} </div>`

//             document.getElementById("bio").innerHTML = `
//         <div > ${bio} </div >`

//             document.getElementById("location").innerHTML = `
//         <div > ${location} </div >`



//             fetch(reposs)
//                 .then((res) => res.json())
//                 .then((data) => {
//                     console.log(data)

//                     const reposContainer = document.getElementById("repos");
//                     reposContainer.innerHTML = "";

//                     data.forEach((repo) => {
//                         const languagesUrl = repo.languages_url

//                         fetch(languagesUrl)
//                             .then((res) => res.json())
//                             .then((languages) => {
//                                 console.log(languages)

//                                 const repoDiv = document.createElement("div");
//                                 repoDiv.innerHTML = `<p>${repo.name}</p>`;

//                                 for (const language in languages) {
//                                     repoDiv.innerHTML += `<span >${language}</span>`;
//                                 }

//                                 repoDiv.style.backgroundColor = "white";
//                                 repoDiv.style.color = "black";

//                                 reposContainer.appendChild(repoDiv);
//                                 reposContainer.appendChild(document.createElement("br"));

//                             })

//                     })

//                 })
//         })
//         .catch(err => {
//             alert(err)
//         })
// })



var form = document.getElementById("myForm");
var page = 1; // Initial page number
var accessToken;
var reposPerPage = 10;
var reposs;

form.addEventListener("submit", function (e) {
    e.preventDefault();

    var search = document.getElementById("search").value;
    var originalName = search.split(' ').join('');
    accessToken = "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";

    fetch(`https://api.github.com/users/${originalName}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((res) => {
            if (!res.ok) {
                alert("User not found: Please enter the correct user name");
                throw new Error("User not found");
            }
            return res.json();
        })
        .then((data) => {
            const avatar = data.avatar_url;
            const name = data.name;
            const bio = data.bio;
            const location = data.location;
            const email = data.email;
            reposs = data.repos_url;

            document.getElementById("result").innerHTML = `<img src ="${avatar}" style="max-width: 100%; height: 100%; border-radius:5px;"/>`;
            document.getElementById("name").innerHTML = `<div>${name} </div>`;
            document.getElementById("bio").innerHTML = `<div>${bio}</div>`;
            document.getElementById("location").innerHTML = `<div>${location}</div>`;

            fetchRepositories(reposs, page, accessToken, reposPerPage);

            document.getElementById("pagination-number").style.display = "block";
        })
        .catch((err) => {
            alert(err);
        });
});


document.getElementById("repos-per-page").addEventListener("change", function (e) {
    reposPerPage = parseInt(e.target.value, 10); // Parse the selected value as an integer
    // Fetch repositories with the updated number per page
    fetchRepositories(reposs, page, accessToken, reposPerPage);
});

function fetchRepositories(reposUrl, pageNumber, accessToken, perPage) {
    fetch(`${reposUrl}?page=${pageNumber}&per_page=${perPage}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },

    })
        .then((res) => res.json())
        .then((data) => {
            const reposContainer = document.getElementById("repos");
            reposContainer.innerHTML = "";

            data.forEach((repo) => {
                const languagesUrl = repo.languages_url;

                fetch(languagesUrl)
                    .then((res) => res.json())
                    .then((languages) => {
                        const repoDiv = document.createElement("div");
                        repoDiv.innerHTML = `<p>${repo.name}</p>`;

                        // for (const language in languages) {
                        //     repoDiv.innerHTML += `<span >${language}</span>`;
                        // }

                        const languageContainer = document.createElement("div");
                        languageContainer.className = "language-container";
                        // Display only the language names without values
                        for (const language in languages) {
                            const span = document.createElement("span");
                            span.textContent = language;
                            languageContainer.appendChild(span);
                        }

                        repoDiv.appendChild(languageContainer);

                        repoDiv.style.backgroundColor = "white";
                        repoDiv.style.color = "black";

                        reposContainer.appendChild(repoDiv);
                        reposContainer.appendChild(document.createElement("br"));
                    });
            });

            // Enable/Disable pagination buttons based on available pages
            document.getElementById("prevPage").disabled = pageNumber <= 1;
            document.getElementById("nextPage").disabled = data.length === 0;
        })
        .catch((err) => {
            alert("Error fetching repositories");
        });
}

function changePage(pageChange) {
    page += pageChange;
    const search = document.getElementById("search").value;
    const originalName = search.split(' ').join('');
    const reposUrl = `https://api.github.com/users/${originalName}/repos`;

    fetchRepositories(reposUrl, page, accessToken, reposPerPage);
}
