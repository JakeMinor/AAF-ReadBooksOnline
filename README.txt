The system consists of 3 components:
    1. Mongo Database
    2. Node.js API
    3. Vue Frontend
    
Run the System
* Assuming the project is being ran on the VM.
   
1. Start the MongoStartUp .bat file (If running on another environment, start mongoDB)

2. Open a new terminal and navigate to the 'backend' folder using the command 'cd backend' from the AAF-ReadBooksOnline directory.

3. Start the API by using the command 'nodemon start'.

4. Open a new terminal and navigate to the 'frontend' folder using the command 'cd frontend' from the AAF-ReadBooksOnline directory.

5. Start the frontend by using the command 'npm run serve'.

Testing the system

Backend

In the backend folder, run the command 'npm run test'. This command will run both the integration and unit tests, once they are finished a coverage report will be produced.

In the frontend folder, run the command 'npm run test:e2e'. This command will run the Web GUI tests, from here a cypress UI should load and you will be able to run the Web GUI tests.

Video Link: https://youtu.be/1AiM77ClnbU