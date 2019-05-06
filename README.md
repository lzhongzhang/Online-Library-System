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
- Install mongo, node js, npm.
- Use npm to install all node_modules showed in json file.
- In terminal, run `mongod` to start mongo.
- In GUI, create a new db connnection, default port is 27017 or access mongodb in terminal, open another window, run `mongo`. 
- Run `node index` under project folder, go to your browser, http://localhost:port/.
