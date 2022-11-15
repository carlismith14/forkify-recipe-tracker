// put all variables that should be constants & reused across the project
// goal of this file is that will allow us to easily configure our project by changing some of the data 
// only variables we want to save here are ones responsible for defining data about application itself 

//uppercase for constants that will never change = uppercase is common practice for config files
export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
export const TIMEOUT_SEC = 10; 
export const RES_PER_PAGE = 10;
export const KEY = 'a989ff99-3a41-400d-8149-ae0cf7d9df09';
export const MODAL_CLOSE_SEC = 2.5;