document.addEventListener('DOMContentLoaded', async () => {
  const reposSection = document.querySelector('.repos-grid');

  try {
    // Show loading message
    reposSection.innerHTML = '<div class="loading">Loading repositories...</div>';

    // Fetch pinned repositories JSON file
    const response = await fetch('pinned_repos.json');
    
    if (!response.ok) {
      throw new Error(`Error fetching JSON: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if the response contains the correct structure
    if (!data || !data.data || !data.data.user || !data.data.user.pinnedItems) {
      throw new Error("Invalid JSON format");
    }

    const pinnedRepos = data.data.user.pinnedItems.nodes;

    // Clear loading message
    reposSection.innerHTML = '';

    // Display repositories
    if (pinnedRepos.length > 0) {
      pinnedRepos.forEach(repo => {
        // Ensure stargazers and forks objects exist
        const stargazerCount = repo.stargazers ? repo.stargazers.totalCount : 0;
        const forkCount = repo.forks ? repo.forks.totalCount : 0;

        const repoCard = document.createElement('div');
        repoCard.className = 'repos-card';
        repoCard.innerHTML = `
          <h3><a href="${repo.url}" target="_blank">${repo.name}</a></h3>
          <p>${repo.description || 'No description available'}</p>
          <div class="repo-stats">
            <span>⭐ ${stargazerCount}</span>
            <span>🍴 ${forkCount}</span>
          </div>
        `;
        reposSection.appendChild(repoCard);
      });
    } else {
      reposSection.innerHTML = '<p>No pinned repositories found.</p>';
    }
  } catch (error) {
    console.error('Error loading repositories:', error);
    reposSection.innerHTML = `<p>Error loading repositories: ${error.message}</p>`;
  }
});
