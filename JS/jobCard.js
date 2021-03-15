class JobList{
  constructor(jobs,jobsCardsContainer){
    this.jobsCardsContainer = jobsCardsContainer;
    this.jobs = jobs ;
    this.jobCards = [] ;
    this.jobFilteringItemsCurr = { currItems : [] , currCards : []} ;
    this.jobFilteringItemsStat = {} ;
    this.jobFilteringHeight = 0 ;
    jobs.forEach(element => {this.addJobCardToContainer(element,jobsCardsContainer);});
  }
  /**
   * Methods that add HTML code to the page
   * 
   * 1-Add a job card to the page .
   * 2-Add a filtering section to the page .
   * 3-Add a searching keyword to the filtering section .
   */

  addJobCardToContainer({
    company , 
    logo , 
    "new" : newOrNot ,
    "featured" : featuredOrNot ,
    position , 
    postedAt , 
    contract , 
    location ,
    role ,
    level , 
    languages ,
    tools
    },jobsCardsContainer){
      let jobCard = document.createElement('div');
      jobCard.classList.add("job-card");
      if(featuredOrNot === true){jobCard.classList.add("job-card--featured");}
      
      jobCard.innerHTML = `
      <div class="job-card__details">
          <img class='job-card__logo' src=${logo} alt="logo" srcset="">
      
          <div class="job-card__details-section-1">
              <div class="job-card__details-section-1-1">
                  <div class="job-card__company">${company}</div>
                  ${ newOrNot === true ? '<div class="job-card__new">new!</div>' : '' }
                  ${ featuredOrNot === true ? '<div class="job-card__featured">featured</div>' : '' }
              </div>
        
              <div class="job-card__details-section-1-2">
                  <div class="job-card__position">${position}</div> 
              </div>
        
              <div class="job-card__details-section-1-3">
                  <div class="job-card__posted-at">${postedAt}</div>
                  <div class="dot">.</div>  
                  <div class="job-card__contract">${contract}</div>
                  <div class="dot">.</div>   
                  <div class="job-card__location">${location}</div> 
              </div> 
          </div>
      </div>
      <div class = "job-card__line"></div>
      <div class="job-card__keywords"></div>
      `;

      [ role , level , ...languages , ...tools ].forEach(element => {
          let jobCardKeywordsItem = document.createElement('div') ;
          jobCardKeywordsItem.classList.add('job-card__keywords-item') ;
          jobCardKeywordsItem.innerText = element ;
          jobCardKeywordsItem.addEventListener('click',()=>{
            this.searchByKeyword(element);
          })
          jobCard.getElementsByClassName('job-card__keywords')[0].append(jobCardKeywordsItem) ;
        });
      this.jobCards.push(jobCard) ;
      jobsCardsContainer.append(jobCard) ;
  }
  addFilteringSectionToContainer(){
    let jobFiltering = document.createElement('div');
    jobFiltering.id = "jobs-filtering" ;
    jobFiltering.classList.add('jobs-filtering') ;
    jobFiltering.innerHTML = `
      <div id="jobs-filtering__container" class="jobs-filtering__container"></div>
      <div id="jobs-filtering__clear" class="jobs-filtering__clear">Clear</div>
    `;
    document.getElementById('jobs-container').before(jobFiltering);  
    
    document.getElementById('jobs-filtering__clear').addEventListener('click',()=>{
      this.resetAll();
    })
  }
  addSearchingKeyword(keyword){
    let jobsFilteringItem = document.createElement('div') ;
    jobsFilteringItem.classList.add('jobs-filtering__item') ; 
    jobsFilteringItem.innerHTML = `
      <div class="jobs-filtering__item-name">${keyword}</div>
      <span class="material-icons jobs-filtering__item-icon">close</span>
    `;
    jobsFilteringItem.getElementsByClassName('jobs-filtering__item-icon')[0].addEventListener('click',()=>{
      this.removeKeyword(keyword , jobsFilteringItem) ;
    })
    document.getElementById('jobs-filtering__container').append(jobsFilteringItem);
    this.adjustJobContMargin(); 
  }
  /**
   * Methods concerning the filtering section
   * 
   * 1-Search by a keyword & add to the filter section .
   * 2-Remove a keword from the filter section .
   * 3-Remove the filter section . 
   */

  searchByKeyword(element){
    if(!this.jobFilteringItemsCurr.currItems.includes(element)){
      if(!(element in this.jobFilteringItemsStat)){
        this.jobFilteringItemsStat[element] = this.checkForExistenceKeyword(element) ;
      }
      if(this.jobFilteringItemsCurr.currCards.length === 0 ){
        this.addFilteringSectionToContainer();
        this.jobFilteringItemsCurr.currCards = this.jobFilteringItemsStat[element];
      }else {
        this.jobFilteringItemsCurr.currCards = this.intersection(
          this.jobFilteringItemsStat[element],
          this.jobFilteringItemsCurr.currCards
        );
      }
      this.jobFilteringItemsCurr.currItems.push(element);
      this.hideAllWithoutInd(this.jobFilteringItemsCurr.currCards);
      this.addSearchingKeyword(element)
    }
  }
  removeKeyword(keyword , jobsFilteringItem){
    this.jobFilteringItemsCurr.currItems = this.jobFilteringItemsCurr.currItems.filter(element => element !== keyword);
    jobsFilteringItem.remove() ;
    if(this.jobFilteringItemsCurr.currItems.length === 0){this.resetAll();}
    else{
      this.jobFilteringItemsCurr.currCards = this.jobFilteringItemsCurrItems() ;
      this.viewAllWithInd(this.jobFilteringItemsCurr.currCards);
    }
    this.adjustJobContMargin() ; 
  }
  resetAll(){
    this.jobFilteringItemsCurr.currCards = [] ;
    this.jobFilteringItemsCurr.currItems = [] ;
    for(let i = 0 ; i < this.jobCards.length ; i++){
      if(this.jobCards[i].style.display === "none"){
        this.jobCards[i].style.display = "flex"
      }
    }
    document.getElementById('jobs-filtering').remove() ;
    this.adjustJobContMargin() ;  

  }
  /**
   * Helper methods
   */

  checkForExistenceKeyword(keyword){
    /**
     * return all idices of the job cards which have the required keyword 
     */
    let requiredInd = [];
    this.jobs.forEach((element,index) => {
      [...element.tools,...element.languages,element.level,element.role].forEach(elementInside => {
        if(elementInside === keyword) {
          requiredInd.push(index);
        }
      });
    });
    return requiredInd;
  }
  hideAllWithoutInd(ind){
    for(let i = 0 ; i < this.jobCards.length ; i++ ){
      if(!ind.includes(i)){
        this.jobCards[i].style.display = "none" ;
      }
    }  
  }
  viewAllWithInd(ind){
    for(let i = 0 ; i < this.jobCards.length ; i++){
      if(ind.includes(i)){
        this.jobCards[i].style.display = "flex";
      }
    }
  }
  jobFilteringItemsCurrItems( ){
    let resultarr = [...Array(jobsList.jobCards.length).keys()];
    this.jobFilteringItemsCurr.currItems.forEach(element => {
      resultarr = this.intersection( resultarr , this.jobFilteringItemsStat[element] ) ;
    })
    return resultarr ;
  }
  intersection( array1 , array2 ){
    return array1.filter(value => array2.includes(value));
  }
  adjustJobContMargin() {
    this.marginOriginal = '100px' ;
    let heightDiff = document.getElementById('jobs-filtering').clientHeight - this.jobFilteringHeight ;
    if( heightDiff !== 0) {
      this.jobFilteringHeight = document.getElementById('jobs-filtering').clientHeight ;
      if(heightDiff < 79){
        document.getElementById('jobs-container').style.marginTop = 
        `${parseInt(document.getElementById('jobs-container').style.marginTop) + heightDiff}px`;    
      }
    }
  }
}
