let jobsContainer = document.getElementById('jobs-container');

jobs.forEach(element => {
    jobsContainer.append(new JobCard(element).jobCard);
});