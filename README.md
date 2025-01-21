# Teacher Evaluation System

## Project Overview

This project is a **Teacher Evaluation System** designed to collect and analyze feedback from students and educational managers in universities. The system aims to improve teaching quality and student satisfaction through data-driven insights and actionable feedback.

### Initial Requirements

The main objectives for the system were:

1. **Feedback System**: Allow students and managers to submit both quantitative and qualitative feedback for teachers.
2. **Interactive Dashboards**: Provide administrators with detailed reports and visualizations of the feedback.
3. **Anonymity**: Ensure that all feedback is anonymous to protect the identity of users.
4. **Mobile Compatibility**: Make the system accessible and responsive on mobile devices.
5. **Notifications**: Notify users about new feedback forms or system updates.
6. **Multilingual Support**: Support multiple languages to cater to diverse user groups.
7. **Form Generation**: Enable administrators to create custom feedback forms and questions.
8. **Data Security**: Adhere to privacy and compliance standards such as GDPR.

## Features Implemented

1. **User Roles and Permissions**:
   - **Administrators**: Can manage users, courses, and feedback forms.
   - **Teachers**: Can view aggregated feedback for self-improvement.
   - **Students**: Can fill out and submit feedback forms.
2. **Dynamic Form Generation**: Admins can create custom feedback forms linked to specific courses.
3. **Feedback Submission**: Students can submit feedback anonymously for specific teachers and courses.
4. **Dashboards**:
   - Teacher dashboard displaying feedback summaries.
5. **Secure Authentication**:
   - Role-based authentication with Supabase.

## Tools and Technologies Used

- **Frontend**:
  - Next.js
- **Backend**:
  - Nest.js
- **Database**:
  - PostgreSQL: For structured data storage and querying via supabase.
- **Containerization**:
  - Docker: To containerize the application for consistent deploymen
- **Other Tools**:
  - Axios: For API calls.
  - TypeScript: For type safety and improved development experience.

---

## How to Run the Project

### Running Without Docker

1. Clone the repository:
   git clone <repository-url>
   cd <repository-name>

2. Open two terminals, on one go to the frontend directory and on the other go to backend

3. Install dependencies:
   npm install

4. Set up environment variables:
   Create a `.env` file in the root of the project with the following content:

   For drontend :
   NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3500
   SUPABASE_URL=
   SUPABASE_ANON_KEY=

   For backend :

   UPABASE_URL=
   SUPABASE_ANON_KEY=
   JWT_SECRET=
   PORT=3500
   FRONTEND_URL=http://localhost:3000/

5. Run the development server:
   in the frontend terminal :
   npm run dev

   in the backend one :
   npm run start

The app will be available at `http://localhost:3000`.

---

### Running With Docker

1. Clone the repository:

   git clone <repository-url>
   cd <repository-name>

2. Build the Docker image:

   docker-compose build

3. Start the application:
   shell
   docker-compose up

4. Access the application at `http://localhost:3000`.

## Completed Features

1. **User Roles and Permissions**:
   - Administrators can create and manage feedback forms.
   - Teachers can view their feedback reports.
   - Students can fill out and submit forms.
2. **Dynamic Form Generation**: Admins can generate forms tied to specific courses.
3. **Feedback Submission**: Students can submit anonymous feedback.
4. **Dashboards**:
   - Admin dashboard for form management
   - Teacher dashboard displaying feedback summaries.
5. **Secure Authentication**: Role-based login with Supabase.

## Missing or Future Features

- **Mobile Compatibility**: Further improvements for mobile usability.
- **Multilingual Support**: Currently, the system supports only one language.
- **Notifications**: Features for notifications (email or in-app) still need to be implemented.
- **Teachers**: Not all features where implemented
- **Students**: : Not all features where implemented, the interface is not that good
- **Security**: : Lot of security improvements need to be done
- **Communication with other systems**: not done
