document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize DB
    StorageModule.init();
    const user = AuthModule.getCurrentUser();
    
    // --- THEME LOGIC START ---
    const savedTheme = localStorage.getItem('sarp_theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    function toggleTheme() {
        const isLight = document.body.classList.toggle('light-mode');
        localStorage.setItem('sarp_theme', isLight ? 'light' : 'dark');
    }
    // --- THEME LOGIC END ---

    // 2. Route
    if (user) initDashboard(user);
    else { UIModule.renderLogin(); attachLoginListeners(); }

    // 3. Listeners
    function attachLoginListeners() {
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const res = AuthModule.login(document.getElementById('email').value, document.getElementById('password').value);
            if (res.success) initDashboard(res.user);
            else {
                const err = document.getElementById('loginError');
                err.classList.remove('hidden');
                err.textContent = res.message;
            }
        });
        document.getElementById('resetDataBtn')?.addEventListener('click', () => {
            if(confirm("Reset all data? This will clear all changes.")) StorageModule.resetData();
        });
    }

    function initDashboard(user) {
        let html = '';
        if (user.role === 'admin') html = UIModule.getAdminUsersHTML();
        else if (user.role === 'teacher') html = UIModule.getTeacherCoursesHTML(StorageModule.getCourses().filter(c => c.teacherId == user.id));
        else html = UIModule.getStudentAttendanceHTML(user);
        UIModule.renderLayout(user, html);
    }

    // Global Click Delegation
    document.body.addEventListener('click', (e) => {
        // Theme Toggle
        if (e.target.closest('#themeToggleBtn')) {
            toggleTheme();
            return;
        }

        const user = AuthModule.getCurrentUser();
        if (!user) return;

        // Logout
        if (e.target.closest('#logoutBtn')) AuthModule.logout();

        // Navigation
        const navBtn = e.target.closest('.nav-btn');
        if (navBtn) {
            const view = navBtn.dataset.view;
            const container = document.getElementById('viewContainer');
            
            if (view === 'admin-users') container.innerHTML = UIModule.getAdminUsersHTML();
            else if (view === 'admin-courses') container.innerHTML = UIModule.getAdminCoursesHTML();
            else if (view === 'teacher-courses') container.innerHTML = UIModule.getTeacherCoursesHTML(StorageModule.getCourses().filter(c => c.teacherId == user.id));
            else if (view === 'student-attendance') container.innerHTML = UIModule.getStudentAttendanceHTML(user);
            else if (view === 'student-results') container.innerHTML = UIModule.getStudentResultsHTML(user);
            else if (view === 'student-notifications') container.innerHTML = UIModule.getNotificationsHTML(user);
        }

        // Open Forms (Teacher)
        if (e.target.closest('[data-action="mark-attendance"]')) {
            const id = e.target.closest('button').dataset.courseId;
            document.getElementById('viewContainer').innerHTML = UIModule.getAttendanceFormHTML(StorageModule.getCourses().find(c=>c.id==id), StorageModule.getUsers().filter(u=>u.role==='student'));
        }
        if (e.target.closest('[data-action="upload-result"]')) {
            const id = e.target.closest('button').dataset.courseId;
            document.getElementById('viewContainer').innerHTML = UIModule.getResultFormHTML(StorageModule.getCourses().find(c=>c.id==id), StorageModule.getUsers().filter(u=>u.role==='student'));
        }
        if (e.target.closest('[data-action="broadcast"]')) {
            const id = e.target.closest('button').dataset.courseId;
            document.getElementById('viewContainer').innerHTML = UIModule.getBroadcastFormHTML(StorageModule.getCourses().find(c=>c.id==id));
        }
        
        // --- NEW: Handle History Views ---
        if (e.target.closest('.view-teacher-history')) {
            const id = e.target.closest('button').dataset.courseId;
            const course = StorageModule.getCourses().find(c => c.id == id);
            document.getElementById('viewContainer').innerHTML = UIModule.getTeacherHistoryView(course);
        }

        if (e.target.closest('.view-student-history')) {
            const id = e.target.closest('button').dataset.courseId;
            const course = StorageModule.getCourses().find(c => c.id == id);
            document.getElementById('viewContainer').innerHTML = UIModule.getStudentHistoryView(course, user);
        }
        // ---------------------------------

        // Navigation Back
        if (e.target.closest('.back-btn')) initDashboard(user);
        
        // Admin Toggles
        if (e.target.closest('#showAddUserForm')) document.getElementById('addUserFormContainer').classList.remove('hidden');
        if (e.target.closest('#showAddCourseForm')) document.getElementById('addCourseFormContainer').classList.remove('hidden');
        
        // Delete Actions
        if (e.target.closest('.delete-user-btn')) {
            if (confirm('Delete User?')) {
                StorageModule.deleteUser(e.target.closest('button').dataset.id);
                document.getElementById('viewContainer').innerHTML = UIModule.getAdminUsersHTML();
            }
        }
        if (e.target.closest('.delete-course-btn')) {
            if (confirm('Delete Course?')) {
                StorageModule.deleteCourse(e.target.closest('button').dataset.id);
                document.getElementById('viewContainer').innerHTML = UIModule.getAdminCoursesHTML();
            }
        }
    });

    // Global Submit Delegation
    document.body.addEventListener('submit', (e) => {
        if (e.target.id === 'addUserForm') {
            e.preventDefault();
            StorageModule.addUser({
                name: document.getElementById('newUserName').value,
                email: document.getElementById('newUserEmail').value,
                role: document.getElementById('newUserRole').value,
                password: 'password'
            });
            alert('User Added Successfully');
            document.getElementById('viewContainer').innerHTML = UIModule.getAdminUsersHTML();
        }
        if (e.target.id === 'addCourseForm') {
            e.preventDefault();
            StorageModule.addCourse({
                name: document.getElementById('newCourseName').value,
                code: document.getElementById('newCourseCode').value,
                teacherId: document.getElementById('newCourseTeacher').value
            });
            alert('Course Added Successfully');
            document.getElementById('viewContainer').innerHTML = UIModule.getAdminCoursesHTML();
        }
        
        if (e.target.id === 'attendanceForm') {
            e.preventDefault();
            const form = e.target;
            const courseId = form.dataset.courseId;
            const date = document.getElementById('attendanceDate').value;
            const students = StorageModule.getUsers().filter(u => u.role === 'student');
            const statusMap = {};
            students.forEach(s => {
                const checked = form.querySelector(`input[name="status_${s.id}"]:checked`);
                if(checked) statusMap[s.id] = checked.value;
            });
            StorageModule.saveAttendance({ courseId, date, students: statusMap });
            alert('Attendance Saved Successfully');
            const user = AuthModule.getCurrentUser();
            document.getElementById('viewContainer').innerHTML = UIModule.getTeacherCoursesHTML(StorageModule.getCourses().filter(c => c.teacherId == user.id));
        }

        if (e.target.id === 'resultForm') {
            e.preventDefault();
            const form = e.target;
            const courseId = form.dataset.courseId;
            const title = document.getElementById('resultTitle').value;
            const maxMarks = document.getElementById('maxMarks').value;
            const students = StorageModule.getUsers().filter(u => u.role === 'student');
            const records = {};
            students.forEach(s => {
                const input = form.querySelector(`input[name="marks_${s.id}"]`);
                if(input && input.value !== '') records[s.id] = Number(input.value);
            });
            StorageModule.saveResult({ courseId, title, maxMarks, records });
            alert('Results Published Successfully');
            const user = AuthModule.getCurrentUser();
            document.getElementById('viewContainer').innerHTML = UIModule.getTeacherCoursesHTML(StorageModule.getCourses().filter(c => c.teacherId == user.id));
        }

        if (e.target.id === 'broadcastForm') {
            e.preventDefault();
            const form = e.target;
            StorageModule.saveBroadcast({
                courseId: form.dataset.courseId,
                courseName: form.dataset.courseName,
                message: document.getElementById('broadcastMsg').value,
                priority: document.getElementById('broadcastPriority').value
            });
            alert('Broadcast Sent Successfully');
            const user = AuthModule.getCurrentUser();
            document.getElementById('viewContainer').innerHTML = UIModule.getTeacherCoursesHTML(StorageModule.getCourses().filter(c => c.teacherId == user.id));
        }
    });
});
