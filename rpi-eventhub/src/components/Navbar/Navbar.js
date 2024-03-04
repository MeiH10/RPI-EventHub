import "./Navbar.css"

const Navbar = () => {
    return ( 
        <nav class="crumbs">
            <ol>
                <li class="crumb"><a href="/">Home</a></li>
                <li class="crumb"><a href="events">Events</a></li>
                <li class="crumb"><a href="about-us">About Us</a></li>

            </ol>
        </nav>
     );
}
 
export default Navbar;