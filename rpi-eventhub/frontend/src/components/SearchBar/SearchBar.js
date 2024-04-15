import SearchBarCSS from './SearchBar.module.css';


const SearchBar = () => {
    return ( 

        <div className={SearchBarCSS.searchBarContainer}>
            <input className={SearchBarCSS.searchInput} type="text" placeholder="Search for an event!" />
            <button className={SearchBarCSS.searchButton}>Search</button>
        </div>

     );
}
 
export default SearchBar;