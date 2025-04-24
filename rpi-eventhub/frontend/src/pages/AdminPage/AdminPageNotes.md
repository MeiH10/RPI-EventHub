To whom it may concern:

This markdown will serve as an introduction to the admin page and some notes on current developments!

Admin Page:

    The admin page serves as RPI EventHub's admin console to control user roles & permissions
    for RPIEventHub. Ideally, this admin page will help admins promote, ban, and change the roles of all the users in RPI Event Hub. This is the minimum functionality the admin page should achieve.

Current Capabilities:
    - Authorization:
        The Admin page is accessible in RPI EventHub to users with the admin role. No other user should be able to access the page and effect anything on the page, let alone view it. 

    - Pulling User Data:
        Real user data is currently pulled from either dev/prod environment depending on if a developer is accessing the page locally/via the web. It displays real users registered to RPI EventHub as well as their user role.

    - Managing Events as Admin:
        Admins are able to delete or edit all events on RPI EventHub.

Things To Do:
    - Authorization:
        While ideally the admin page is inaccessible outside of being an admin, it's always good to check! See if you can break into the admin page if you are not an admin. Get creative with it too, like using BurpSuite :).

    - Changing User Roles:
        While real users are pulled, you cannot change the user roles for it just yet. The scaffolding for the operation is there, but the logic and implementation still needs to be done.

    - Other Functionalities:
        Adding other functionalities typical of admins is also welcome to include in the admin page. Anything you think will be useful to an admin, work on including!