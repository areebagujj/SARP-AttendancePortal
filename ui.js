const UIModule = (function() {
    const app = document.getElementById('app');
    const clear = () => app.innerHTML = '';

    // --- 1. Login Screen ---
    function renderLogin() {
        clear();
        app.innerHTML = `
            <div class="login-wrapper fade-in">
                <div class="login-card">
                    <div class="login-header">
                        <div class="brand-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                        </div>
                        <h2 class="login-title">Welcome to SARP</h2>
                        <p class="login-subtitle">Student Attendance & Result Portal</p>
                    </div>
                    <form id="loginForm">
                        <div class="form-group">
                            <label class="form-label">Email Address</label>
                            <input type="email" id="email" class="form-control" value="teacher@school.com" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" id="password" class="form-control" value="password" required>
                        </div>
                        <div id="loginError" class="hidden" style="color:var(--danger); margin-bottom:1rem; font-size:0.9rem;"></div>
                        <button type="submit" class="btn btn-primary">Sign In</button>
                    </form>
                    <div class="demo-box">
                        <div class="demo-row"><b>Admin:</b> admin@school.com / password</div>
                        <div class="demo-row"><b>Teacher:</b> teacher@school.com / password</div>
                        <div class="demo-row"><b>Student:</b> student@school.com / password</div>
                        <div class="demo-row"><b>Parent:</b> parent@school.com / password</div>
                    </div>
                    <button id="resetDataBtn" class="btn-text">Reset Database</button>
                </div>
            </div>`;
    }

    // --- 2. Main Layout (Sidebar + Content) ---
    function renderLayout(user, contentHTML) {
        clear();
        let navLinks = '';
        
        // Role-Based Navigation
        if (user.role === 'admin') {
            navLinks = `
                <button class="nav-btn" data-view="admin-users"><span>👥</span> Manage Users</button>
                <button class="nav-btn" data-view="admin-courses"><span>📚</span> Manage Courses</button>
            `;
        } else if (user.role === 'teacher') {
            navLinks = `<button class="nav-btn" data-view="teacher-courses"><span>🎓</span> My Courses</button>`;
        } else if (user.role === 'student' || user.role === 'parent') {
            navLinks = `
                <button class="nav-btn" data-view="student-attendance"><span>📅</span> Attendance</button>
                <button class="nav-btn" data-view="student-results"><span>📊</span> Results</button>
                <button class="nav-btn" data-view="student-notifications"><span>🔔</span> Notifications</button>
            `;
        }

        app.innerHTML = `
            <div class="dashboard-layout fade-in">
                <aside class="sidebar">
                    <div class="sidebar-header">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                        <span>SARP</span>
                    </div>
                    
                    <div class="user-info">
                        <div class="avatar">${user.name.charAt(0)}</div>
                        <div class="user-details">
                            <h4>${user.name}</h4>
                            <span>${user.role}</span>
                        </div>
                    </div>
                    
                    <div class="nav-section">${navLinks}</div>
                    
                    <button id="themeToggleBtn" class="theme-toggle-btn">
                        <span>🌓</span> <span>Switch Theme</span>
                    </button>

                    <div class="logout-section">
                        <button id="logoutBtn" class="btn btn-logout">Sign Out</button>
                    </div>
                </aside>
                
                <main class="main-content">
                    <div id="viewContainer" class="container">
                        ${contentHTML}
                    </div>
                </main>
            </div>`;
    }

    // --- 3. Admin Views ---
    function getAdminUsersHTML() {
        const users = StorageModule.getUsers();
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>User Management</h1>
                    <p>Manage student, teacher, and admin accounts</p>
                </div>
                <button id="showAddUserForm" class="btn btn-primary" style="width:auto">+ Add User</button>
            </div>
            
            <div id="addUserFormContainer" class="hidden card fade-in" style="margin-bottom:2rem;">
                <form id="addUserForm" class="form-row">
                    <input type="text" id="newUserName" placeholder="Full Name" required class="form-control">
                    <input type="email" id="newUserEmail" placeholder="Email Address" required class="form-control">
                    <select id="newUserRole" class="form-control">
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button type="submit" class="btn btn-success" style="width:auto">Save</button>
                </form>
            </div>
            
            <div class="table-wrapper">
                <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th style="text-align:right">Action</th></tr></thead>
                    <tbody>${users.map(u => `
                        <tr class="table-row">
                            <td style="font-weight:600">${u.name}</td>
                            <td>${u.email}</td>
                            <td><span style="text-transform:capitalize; background:var(--primary-light); color:var(--primary); padding:2px 8px; border-radius:4px; font-size:0.75rem; font-weight:600;">${u.role}</span></td>
                            <td style="text-align:right"><button class="text-danger delete-user-btn" data-id="${u.id}">Delete</button></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
    }

    function getAdminCoursesHTML() {
        const courses = StorageModule.getCourses();
        const teachers = StorageModule.getUsers().filter(u => u.role === 'teacher');
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Course Management</h1>
                    <p>Assign courses to teachers</p>
                </div>
                <button id="showAddCourseForm" class="btn btn-primary" style="width:auto">+ Add Course</button>
            </div>
            
            <div id="addCourseFormContainer" class="hidden card fade-in" style="margin-bottom:2rem;">
                <form id="addCourseForm" class="form-row">
                    <input type="text" id="newCourseName" placeholder="Course Name" required class="form-control">
                    <input type="text" id="newCourseCode" placeholder="Code (e.g. CS101)" required class="form-control">
                    <select id="newCourseTeacher" class="form-control">
                        <option value="">Select Teacher</option>
                        ${teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                    </select>
                    <button type="submit" class="btn btn-success" style="width:auto">Save</button>
                </form>
            </div>
            
            <div class="card-grid">
                ${courses.map(c => { 
                    const teacher = teachers.find(t => t.id == c.teacherId); 
                    return `
                    <div class="card">
                        <span class="card-badge">${c.code}</span>
                        <h3 style="font-size:1.1rem; font-weight:600; margin-bottom:0.5rem;">${c.name}</h3>
                        <p style="font-size:0.875rem; color:var(--text-light)">Teacher: ${teacher ? teacher.name : 'Unassigned'}</p>
                        <button class="text-danger delete-course-btn" data-id="${c.id}" style="margin-top:1rem; font-size:0.875rem; background:none; border:none; cursor:pointer;">Remove Course</button>
                    </div>`
                }).join('')}
            </div>`;
    }

    // --- 4. Teacher Views ---
    function getTeacherCoursesHTML(courses) {
        if (courses.length === 0) return `<div style="text-align:center; padding:4rem; color:var(--text-light)"><h2>No courses assigned yet.</h2></div>`;
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>My Courses</h1>
                    <p>Manage attendance, results, and alerts</p>
                </div>
            </div>
            <div class="card-grid">
                ${courses.map(course => `
                <div class="card">
                    <span class="card-badge">${course.code}</span>
                    <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:1rem;">${course.name}</h3>
                    <div class="card-actions" style="grid-template-columns: 1fr 1fr 1fr;">
                        <button class="btn-card" data-action="mark-attendance" data-course-id="${course.id}">📅 <span style="font-size:0.75rem">Attend</span></button>
                        <button class="btn-card" data-action="upload-result" data-course-id="${course.id}">📊 <span style="font-size:0.75rem">Results</span></button>
                        <button class="btn-card" data-action="broadcast" data-course-id="${course.id}">📢 <span style="font-size:0.75rem">Alert</span></button>
                    </div>
                    <button class="btn-text view-teacher-history" data-course-id="${course.id}" style="margin-top:1rem;">View Uploaded Records</button>
                </div>`).join('')}
            </div>`;
    }

    // NEW: Teacher History View
    function getTeacherHistoryView(course) {
        const allAttendance = StorageModule.getAttendance().filter(a => a.courseId == course.id);
        const allResults = StorageModule.getResults().filter(r => r.courseId == course.id);

        return `
            <div class="page-header" style="justify-content:flex-start; gap:1rem;">
                <button class="back-btn">←</button>
                <div class="page-title">
                    <h1>Records History</h1>
                    <p>${course.name} (${course.code})</p>
                </div>
            </div>
            
            <div class="card-grid" style="grid-template-columns: 1fr;">
                <div class="card">
                    <h3 style="margin-bottom:1rem; color:var(--text-heading);">Attendance History</h3>
                    <div class="table-wrapper">
                        <table>
                            <thead><tr><th>Date</th><th>Present</th><th>Absent</th></tr></thead>
                            <tbody>
                                ${allAttendance.length === 0 ? '<tr><td colspan="3" style="text-align:center">No attendance records found.</td></tr>' : 
                                allAttendance.map(record => {
                                    const present = Object.values(record.students).filter(s => s === 'present').length;
                                    const absent = Object.values(record.students).filter(s => s === 'absent').length;
                                    return `
                                    <tr class="table-row">
                                        <td style="font-weight:600">${record.date}</td>
                                        <td style="color:var(--secondary)">${present}</td>
                                        <td style="color:var(--danger)">${absent}</td>
                                    </tr>
                                    `;
                                }).reverse().join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card">
                    <h3 style="margin-bottom:1rem; color:var(--text-heading);">Result History</h3>
                    <div class="table-wrapper">
                        <table>
                            <thead><tr><th>Assessment Title</th><th>Max Marks</th><th>Submission ID</th></tr></thead>
                            <tbody>
                                ${allResults.length === 0 ? '<tr><td colspan="3" style="text-align:center">No results uploaded yet.</td></tr>' : 
                                allResults.map(res => `
                                    <tr class="table-row">
                                        <td style="font-weight:600">${res.title}</td>
                                        <td>${res.maxMarks}</td>
                                        <td style="font-size:0.8rem; color:var(--text-light)">${res.id}</td>
                                    </tr>
                                `).reverse().join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    function getAttendanceFormHTML(course, students) {
        const today = new Date().toISOString().split('T')[0];
        return `
            <div class="page-header" style="justify-content:flex-start; gap:1rem;">
                <button class="back-btn">←</button>
                <div class="page-title">
                    <h1>Mark Attendance</h1>
                    <p>${course.name} (${course.code})</p>
                </div>
            </div>
            <div class="card fade-in">
                <form id="attendanceForm" data-course-id="${course.id}">
                    <div class="form-group">
                        <label class="form-label">Select Date</label>
                        <input type="date" id="attendanceDate" value="${today}" class="form-control" style="width:200px">
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead><tr><th>Student Name</th><th style="text-align:center">Status</th></tr></thead>
                            <tbody>${students.map(s => `
                                <tr class="table-row">
                                    <td style="font-weight:500">${s.name}</td>
                                    <td style="display:flex; justify-content:center;">
                                        <div class="status-radio">
                                            <label class="radio-label"><input type="radio" name="status_${s.id}" value="present" checked> <span style="color:var(--secondary)">Present</span></label>
                                            <label class="radio-label"><input type="radio" name="status_${s.id}" value="absent"> <span style="color:var(--danger)">Absent</span></label>
                                        </div>
                                    </td>
                                </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div style="margin-top:1.5rem; text-align:right;">
                        <button type="submit" class="btn btn-primary" style="width:auto">Save Attendance</button>
                    </div>
                </form>
            </div>`;
    }

    function getResultFormHTML(course, students) {
        return `
            <div class="page-header">
                <div style="display:flex; align-items:center; gap:1rem;">
                    <button class="back-btn">←</button>
                    <div class="page-title">
                        <h1>Upload Results</h1>
                        <p>${course.name}</p>
                    </div>
                </div>
                <button onclick="window.print()" class="btn btn-outline no-print">🖨️ Print Report</button>
            </div>
            <div class="card fade-in">
                <form id="resultForm" data-course-id="${course.id}">
                    <div class="form-row">
                        <div style="flex:1"><label class="form-label">Assessment Title</label><input type="text" id="resultTitle" placeholder="e.g. Final Exam" required class="form-control"></div>
                        <div style="flex:1"><label class="form-label">Max Marks</label><input type="number" id="maxMarks" value="100" required class="form-control"></div>
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead><tr><th>Student Name</th><th>Marks Obtained</th></tr></thead>
                            <tbody>${students.map(s => `
                                <tr class="table-row">
                                    <td style="font-weight:500">${s.name}</td>
                                    <td><input type="number" name="marks_${s.id}" placeholder="0" class="form-control" style="width:100px"></td>
                                </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div style="margin-top:1.5rem; text-align:right;">
                        <button type="submit" class="btn btn-success" style="width:auto">Publish Results</button>
                    </div>
                </form>
            </div>`;
    }

    function getBroadcastFormHTML(course) {
        return `
            <div class="page-header" style="justify-content:flex-start; gap:1rem;">
                <button class="back-btn">←</button>
                <div class="page-title">
                    <h1>Broadcast Message</h1>
                    <p>${course.name}</p>
                </div>
            </div>
            <div class="card fade-in" style="max-width:600px; margin:0 auto;">
                <form id="broadcastForm" data-course-id="${course.id}" data-course-name="${course.name}">
                    <div class="form-group">
                        <label class="form-label">Message Content</label>
                        <textarea id="broadcastMsg" rows="4" class="form-control" placeholder="e.g. Class cancelled tomorrow due to weather..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Priority</label>
                        <select id="broadcastPriority" class="form-control">
                            <option value="Normal">Normal</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Send Broadcast</button>
                </form>
            </div>`;
    }

    // --- 5. Student/Parent Views ---
    function getStudentAttendanceHTML(user) {
        const targetId = user.childId || user.id;
        const courses = StorageModule.getCourses();
        const allAttendance = StorageModule.getAttendance();
        
        return `
            <div class="page-header"><div class="page-title"><h1>Attendance Overview</h1><p>${user.role === 'parent' ? "Student's" : "Your"} Presence</p></div></div>
            <div class="card-grid">
                ${courses.map(course => { 
                    const courseAttendance = allAttendance.filter(r => r.courseId == course.id); 
                    let presentCount = 0, totalClasses = 0; 
                    courseAttendance.forEach(r => { const status = r.students[targetId]; if (status) { totalClasses++; if (status === 'present') presentCount++; } }); 
                    const pct = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0; 
                    const isLow = pct < 75; 
                    return `
                    <div class="attendance-card">
                        <div class="attendance-header">
                            <div><h3 style="font-size:1.1rem; font-weight:700">${course.name}</h3><span style="font-size:0.8rem; color:var(--text-light)">${course.code}</span></div>
                            <span class="percent-large ${isLow ? 'color-danger' : 'color-success'}">${pct}%</span>
                        </div>
                        <div>
                            <div class="progress-track"><div class="progress-fill ${isLow ? 'bg-danger' : 'bg-success'}" style="width: ${pct}%"></div></div>
                            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:600; color:var(--text-light)">
                                <span>${presentCount} / ${totalClasses} Attended</span>
                                ${isLow ? '<span class="color-danger">⚠️ Low Attendance</span>' : '<span class="color-success">Good Standing</span>'}
                            </div>
                        </div>
                        <button class="btn-text view-student-history" data-course-id="${course.id}" style="margin-top:1.5rem; text-align:center;">View Date-wise Details</button>
                    </div>`; 
                }).join('')}
            </div>`;
    }

    // NEW: Student History/Date-wise View
    function getStudentHistoryView(course, user) {
        const targetId = user.childId || user.id;
        const allAttendance = StorageModule.getAttendance().filter(a => a.courseId == course.id);
        
        // Filter records where this specific student was marked
        const myRecords = allAttendance.filter(r => r.students[targetId] !== undefined);

        return `
            <div class="page-header" style="justify-content:flex-start; gap:1rem;">
                <button class="back-btn">←</button>
                <div class="page-title">
                    <h1>Attendance Log</h1>
                    <p>${course.name}</p>
                </div>
            </div>
            
            <div class="card fade-in">
                <div class="table-wrapper">
                    <table>
                        <thead><tr><th>Date</th><th>Status</th></tr></thead>
                        <tbody>
                            ${myRecords.length === 0 ? '<tr><td colspan="2" style="text-align:center">No records found.</td></tr>' : 
                            myRecords.map(r => {
                                const status = r.students[targetId];
                                const isPresent = status === 'present';
                                return `
                                <tr class="table-row">
                                    <td style="font-weight:500">${r.date}</td>
                                    <td>
                                        <span style="font-weight:700; color:${isPresent ? 'var(--secondary)' : 'var(--danger)'}">
                                            ${isPresent ? 'Present' : 'Absent'}
                                        </span>
                                    </td>
                                </tr>`;
                            }).reverse().join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function getStudentResultsHTML(user) {
        const targetId = user.childId || user.id;
        const courses = StorageModule.getCourses();
        const allResults = StorageModule.getResults();
        const myResults = allResults.filter(r => r.records && r.records[targetId] !== undefined);
        
        return `
            <div class="page-header"><div class="page-title"><h1>Academic Results</h1><p>${user.role === 'parent' ? "Student's" : "Your"} Grades</p></div></div>
            <div class="card" style="padding:0; overflow:hidden;">
                ${myResults.length === 0 ? '<div style="padding:2rem; text-align:center; color:var(--text-light)">No results available yet.</div>' : 
                `<div>${myResults.map(res => { 
                        const course = courses.find(c => c.id == res.courseId); 
                        const marks = res.records[targetId]; 
                        const pct = (marks/res.maxMarks) * 100; 
                        let grade = 'F'; 
                        if (pct >= 90) grade = 'A'; else if (pct >= 80) grade = 'B'; else if (pct >= 70) grade = 'C'; else if (pct >= 60) grade = 'D'; 
                        return `
                        <div class="result-row">
                            <div class="result-info">
                                <div class="grade-circle grade-${grade}">${grade}</div>
                                <div><h4 style="font-weight:700; font-size:1.1rem;">${res.title}</h4><span style="color:var(--text-light); font-size:0.875rem;">${course ? course.name : 'Unknown'}</span></div>
                            </div>
                            <div style="text-align:right"><div style="font-size:1.25rem; font-weight:700;">${marks} <span style="font-size:0.875rem; color:var(--text-light); font-weight:400">/ ${res.maxMarks}</span></div><div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-light); letter-spacing:0.05em; font-weight:600;">Score</div></div>
                        </div>`; 
                    }).join('')}
                </div>`}
            </div>`;
    }

    function getNotificationsHTML(user) {
        const broadcasts = StorageModule.getBroadcasts();
        return `
            <div class="page-header"><div class="page-title"><h1>Notifications</h1><p>Class announcements</p></div></div>
            <div class="card-grid" style="grid-template-columns:1fr;">
                ${broadcasts.length === 0 ? '<div class="card" style="text-align:center; color:var(--text-light)">No new notifications.</div>' : 
                broadcasts.map(b => `
                    <div class="card" style="border-left: 4px solid ${b.priority==='Urgent'?'var(--danger)':'var(--primary)'}">
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                            <span style="font-weight:700; color:var(--text-heading)">${b.courseName}</span>
                            <span style="font-size:0.8rem; color:var(--text-light)">${b.date || 'Today'}</span>
                        </div>
                        <p style="color:var(--text-main)">${b.message}</p>
                        ${b.priority==='Urgent' ? '<span style="font-size:0.7rem; color:var(--danger); font-weight:bold; text-transform:uppercase; margin-top:0.5rem; display:block;">Urgent</span>' : ''}
                    </div>
                `).reverse().join('')}
            </div>`;
    }

    return {
        renderLogin, renderLayout,
        getAdminUsersHTML, getAdminCoursesHTML,
        getTeacherCoursesHTML, getAttendanceFormHTML, getResultFormHTML, getBroadcastFormHTML,
        getStudentAttendanceHTML, getStudentResultsHTML, getNotificationsHTML,
        
        // Exporting new functions
        getStudentHistoryView, getTeacherHistoryView
    };
})();
