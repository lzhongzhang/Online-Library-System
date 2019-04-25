# Online Library Management System

### Implemented following major functionalities:
- User signup: Register a new user to the system. 
  - Check the new username or email address if it’s already registered to the system. 
  - Form validation: Check if all mandatory fields are filled out.
  - Check if password is strong enough. Define the rules of having a strong password. User passwords will be hashed and hashed version of passwords will be stored in the database.
- User login
- List available books in the system. User can filter the results based on at least one criterion (i.e. Book's name). Also, can “Search” for a specific item.
- Implemented Favorites function.
- For Admin user(s):
  - List all items
  - Add new item
  - Delete item
  - Update item
- For delete, soft-delete should be implemented.

### Frond-end Design
HTML5, CSS, Bootstrap.

### Back-end Design
Node.JS, MongoDB.

### How to run the project
- Before you run the project, you need to make sure you have installed mongo, node js, npm.
- In the back end, Express.js was used to build the backend, so please make sure you install Express.js in your npm, and also, even if node_modules is already in the project, I recommand you install it in your folder, as well as some other modules like body-parser.
- After you install all modules you need, you can work on database part. In this project, I used mongodb as database, you can download mongo from internet(for Mac, you can use `brew install mongo`). If you would like a GUI for operations, download Robo 3T. In terminal, input `mongo` to start mongo, in GUI, create a new db connnection, default port is 27017, after connection, you can see your database. If you want to access mongodb in terminal, just type mongod in terminal. Please make sure mongodb is already on.
- After all set, run your project in terminal, `node index`, then go to your browser, http://localhost:port/, your could see you homepage.
