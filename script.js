document.getElementById('searchForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim(); // Trim whitespaces from the username
  if (username) {
      fetchRepositories(username);
  } else {
      alert('Please enter a GitHub username.');
  }
});

function fetchRepositories(username, page = 1, perPage = 6) {
  const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`;

  showLoader();

  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Failed to fetch repositories: ${response.statusText}`);
          }
          return response.json();
      })
      .then(repositories => {
          hideLoader();
          displayRepositories(repositories);
          updatePaginationControls(username, page, perPage, repositories.length);
      })
      .catch(error => {
          hideLoader();
          console.error('Error fetching repositories:', error);
          document.getElementById('repositoriesList').innerHTML = '<li>Error fetching repositories. Please try again.</li>';
      });
}


function displayRepositories(repositories) {
  
  
    const repositoriesList = document.getElementById('repositoriesList');
    repositoriesList.innerHTML = '';
  
    // Display user details only once
    const owner = repositories[0].owner;
    const userDetails = document.createElement('div');
    
    userDetails.innerHTML = `
    <img src="${owner.avatar_url}" alt="${owner.login}" class="user-avatar">
    <h2 class="user-name">${owner.login}</h2>
    ${owner.bio ? `<p class="user-bio">${owner.bio}</p>` : ''}
    ${owner.location ? `<p class="user-location">Location: ${owner.location}</p>` : ''}
    <p class="user-links">
      ${owner.twitter_username ? `<a href="https://twitter.com/${owner.twitter_username}" target="_blank">Twitter:https://twitter.com/${owner.twitter_username}</a>` : ''}
      <a href="${owner.html_url}" target="_blank">GitHub:https://github.com/${owner.login}</a>
    </p>
  `;
    repositoriesList.appendChild(userDetails);

  repositories.forEach(repo => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
    
      <div class="repo-item">
      
        <a class="repo-link" href="${repo.html_url}" target="_blank">${repo.name}</a>
        <div class="repo-details">
          <button class="language-btn">${repo.language || 'Not specified'}</button>
          <p class="repo-description">${repo.description || 'No description available'}</p>
        </div>
      </div>
    `;
    repositoriesList.appendChild(listItem);
  });
}




function updatePaginationControls(username, currentPage, perPage, fetchedCount) {
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const currentPageSpan = document.getElementById('currentPage');
  const paginationControls = document.getElementById('paginationControls');

  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = fetchedCount < perPage;

  prevPageBtn.removeEventListener('click', onPrevPageClick);
  nextPageBtn.removeEventListener('click', onNextPageClick);

  prevPageBtn.addEventListener('click', () => fetchRepositories(username, currentPage -= 1, perPage));
  nextPageBtn.addEventListener('click', () => fetchRepositories(username, currentPage += 1, perPage));

  currentPageSpan.textContent = `Page ${currentPage}`;
  paginationControls.style.display = 'flex';
}

function showLoader() {
  document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

// Add these lines to fix the event listener removal issue
const onPrevPageClick = () => fetchRepositories(username, currentPage -= 1, perPage);
const onNextPageClick = () => fetchRepositories(username, currentPage += 1, perPage);