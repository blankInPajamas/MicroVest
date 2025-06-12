# MicroVest

In order to run this repo, do the following steps:

1. Git clone this repo. Head to the folder using "cd MicroVest".
2. Then, proceed to use the following cmd:

    > npm install

3. Once you are done with this, you should be able to use this repo.

   > npm run dev

------------------------------------------------------------------------

To check if the backend is working, do the following steps:

1. Install xampp and have the server up running
2. Create a database named "microvest_db"
3. Head to backend folder in the terminal and run the following commands:

    > python manage.py makemigrations

    > python manage.py migrate

4. Once they are done, run the following command:

    > python manage.py runserver

5. Head over to 127.0.0.1:8000/accounts/signup to start your journey.