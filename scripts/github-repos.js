async function fetchPinnedRepos() {
  const username = "BUZZKILL1549";
  const reposSection = document.querySelector(".repos-grid");

  // GitHub GraphQL API endpoint
  const apiUrl = "https://api.github.com/graphql";
  
  // Your GitHub Personal Access Token (store securely!)

  const query = `
    query {
      user(login: "${username}") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazers {
                totalCount
              }
              forks {
                totalCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    reposSection.innerHTML = "<div class='loading'>Loading repositories...</div>";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const pinnedRepos = data.data.user.pinnedItems.nodes;

    reposSection.innerHTML = "";

    if (pinnedRepos.length > 0) {
      pinnedRepos.forEach((repo) => {
        const repoCard = document.createElement("div");
        repoCard.className = "repos-card";
        repoCard.innerHTML = `
          <h3><a href="${repo.url}" target="_blank">${repo.name}</a></h3>
          <p>${repo.description || "No description available"}</p>
          <div class="repo-stats">
            <span>⭐ ${repo.stargazers.totalCount}</span>
            <span>🍴 ${repo.forks.totalCount}</span>
          </div>
        `;
        reposSection.appendChild(repoCard);
      });
    } else {
      reposSection.innerHTML = "<p>No pinned repositories found.</p>";
    }
  } catch (error) {
    console.error("Error fetching repositories:", error);
    reposSection.innerHTML = `<p>Error loading repositories: ${error.message}</p>`;
  }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchPinnedRepos);
