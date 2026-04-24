# AGENTS.md
## Project Name
Verified Alumni–Student Networking Platform
## Project Type
Full-stack MERN application using React + Vite, Node.js, Express.js, MongoDB, 
JWT, and Tailwind CSS.
## Goal
Build a verified institute-based alumni-student networking system where 
institutes can manage students and alumni, students can discover verified 
alumni, and alumni can provide mentorship, referrals, guidance, and 
opportunities.
## Main Roles
1. SUPER_ADMIN
2. INSTITUTE_ADMIN
3. STUDENT
4. ALUMNI
## Core Rules- Always follow role-based access control.- Users must only access data from their own institute unless they are 
SUPER_ADMIN.- Alumni search should show only verified and active alumni to students.- Passwords must always be hashed using bcrypt.- JWT must be required for all protected routes.- Do not expose password fields in API responses.- Do not commit .env files.- Use consistent API response format.- Use controller-service-model separation where practical.- Keep frontend components reusable and clean.- Use Tailwind CSS for styling.- Use simple, professional UI.
## Backend Standards- Use Express Router for route files.- Use Mongoose models for database collections.
51
-Use asyncHandler for async controller errors.-Use centralized error middleware.-Use role middleware for protected role-based routes.-Use pagination for list APIs.-Validate inputs before database operations.-Return proper HTTP status codes.
## Frontend Standards-Use React functional components.-Use React Router for routing.-Use Axios for API calls.-Keep API logic in src/api files.-Use AuthContext for authentication state.-Use ProtectedRoute and RoleRoute for access control.-Use reusable form components.-Show loading and error states.-Use responsive Tailwind layouts.
## Folder Structure
Follow the repository structure defined in the planning document.
## Environment Variables
Backend .env example:
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/alumni-connect
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
Frontend .env example:
VITE_API_BASE_URL=http://localhost:5000/api
## MVP Build Order
1. Project setup
2. Backend base setup
3. Database connection
4. User model and auth
5. Role middleware
6. Institute registration and approval
7. User management
8. Student and alumni profiles
9. Alumni search
10. Connection requests
11. Guidance/referral requests
12. Opportunities
52
13. Announcements and events
14. Notifications
15. Testing and deployment
## Coding Instructions for Codex- Before modifying code, inspect existing files.- Do not overwrite unrelated files.- Keep changes small and focused.- After each feature, update README if needed.- Add meaningful comments only where necessary.- Do not create unnecessary dependencies.- Prefer simple implementation over over-engineering.- Ensure backend and frontend remain consistent with API contracts.
## Testing Instructions- Test authentication flows.- Test role access restrictions.- Test institute data isolation.- Test student-to-alumni request flows.- Test alumni verification before visibility in search.- Test opportunity approval flow.
## Security Notes
## Expected Output Style- Never return password hashes.- Check authenticated user role in every protected action.- Validate institute ownership before returning or updating institute-specific 
data.- Use environment variables for secrets.- Sanitize and validate user input.
When implementing features, provide:
1. Files changed
2. Summary of changes
3. How to test
4. Any pending task