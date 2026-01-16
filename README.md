# How to run
```
cd backend 
npm install 
node src\index.js
```

```
cd frontend
npm install
npm run dev
```
**.env file**
the .env file (backend/.env) should have the following structure
```
CLIENT_ID=
CLIENT_SECRET=
REDIRECT_URI=http://localhost:3000/callback
OPENROUTER_API_KEY=
```
# Structure
Backend: 
  - authenticate with aikido
  - get all active repo's
  - get all issues for 1 repo
  - request free code fix using openrouter
Frontend:
  - display data
  - request fix
  - contact backend
# Demo
https://github.com/user-attachments/assets/a7417444-c90a-4541-a238-2774ad94eedc

