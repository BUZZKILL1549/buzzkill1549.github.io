async function fetchPinnedRepos() {
  const reposSection = document.querySelector('.repos-grid');

  try {
    // Fetch the JSON file from your GitHub repository
    const response = await fetch('https://raw.githubusercontent.com/BUZZKILL1549/buzzkill1549.github.io/main/pinned_repos.json');

    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status}`);
    }

    const repos = await response.json();
    
    // Clear existing content
    reposSection.innerHTML = '';

    // Create repository cards
    repos.forEach(repo => {
      const repoCard = document.createElement('div');
      repoCard.className = 'repos-card';
      repoCard.innerHTML = `
        <h3><a href="${repo.url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description || 'No description available'}</p>
        <div class="repo-stats">
          <span>⭐ ${repo.stargazers.totalCount}</span>
          <span>🍴 ${repo.forks.totalCount}</span>
        </div>
      `;
      reposSection.appendChild(repoCard);
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    reposSection.innerHTML = `<p>Error loading repositories: ${error.message}</p>`;
  }
}

// Load the repositories when the page loads
document.addEventListener('DOMContentLoaded', fetchPinnedRepos);
