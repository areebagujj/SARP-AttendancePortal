const StorageModule = (function() {
    const KEYS = {
        USERS: 'sarp_users',
        COURSES: 'sarp_courses',
        ATTENDANCE: 'sarp_attendance',
        RESULTS: 'sarp_results',
        BROADCASTS: 'sarp_broadcasts', // New Key for SRS-015
        CURRENT_USER: 'sarp_current_user'
    };

    function init() {
        if (!localStorage.getItem(KEYS.USERS)) {
            const users = [
                { id: 1, name: 'Principal Skinner', email: 'admin@school.com', password: 'password', role: 'admin' },
                { id: 2, name: 'Edna Krabappel', email: 'teacher@school.com', password: 'password', role: 'teacher' },
                { id: 3, name: 'Bart Simpson', email: 'student@school.com', password: 'password', role: 'student' },
                { id: 4, name: 'Lisa Simpson', email: 'lisa@school.com', password: 'password', role: 'student' },
                // FIX: Added childId to link Parent to Student
                { id: 5, name: 'Homer Simpson', email: 'parent@school.com', password: 'password', role: 'parent', childId: 3 }
            ];
            localStorage.setItem(KEYS.USERS, JSON.stringify(users));
        }
        if (!localStorage.getItem(KEYS.COURSES)) {
            const courses = [
                { id: 101, code: 'MATH101', name: 'Mathematics', teacherId: 2 },
                { id: 102, code: 'SCI202', name: 'Science', teacherId: 2 }
            ];
            localStorage.setItem(KEYS.COURSES, JSON.stringify(courses));
        }
        if (!localStorage.getItem(KEYS.ATTENDANCE)) localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify([]));
        if (!localStorage.getItem(KEYS.RESULTS)) localStorage.setItem(KEYS.RESULTS, JSON.stringify([]));
        if (!localStorage.getItem(KEYS.BROADCASTS)) localStorage.setItem(KEYS.BROADCASTS, JSON.stringify([]));
    }

    const get = (key) => JSON.parse(localStorage.getItem(key) || '[]');
    const set = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    return {
        init,
        getUsers: () => get(KEYS.USERS),
        getCourses: () => get(KEYS.COURSES),
        getAttendance: () => get(KEYS.ATTENDANCE),
        getResults: () => get(KEYS.RESULTS),
        getBroadcasts: () => get(KEYS.BROADCASTS),
        
        addUser: (user) => { const users = get(KEYS.USERS); user.id = Date.now(); users.push(user); set(KEYS.USERS, users); },
        deleteUser: (id) => { const users = get(KEYS.USERS).filter(u => u.id != id); set(KEYS.USERS, users); },
        addCourse: (course) => { const courses = get(KEYS.COURSES); course.id = Date.now(); courses.push(course); set(KEYS.COURSES, courses); },
        deleteCourse: (id) => { const courses = get(KEYS.COURSES).filter(c => c.id != id); set(KEYS.COURSES, courses); },
        saveAttendance: (record) => { const records = get(KEYS.ATTENDANCE); const filtered = records.filter(r => !(r.courseId == record.courseId && r.date === record.date)); filtered.push(record); set(KEYS.ATTENDANCE, filtered); },
        saveResult: (result) => { const results = get(KEYS.RESULTS); results.push({ ...result, id: Date.now() }); set(KEYS.RESULTS, results); },
        
        // New Function for SRS-015
        saveBroadcast: (msg) => { const msgs = get(KEYS.BROADCASTS); msgs.push({ ...msg, id: Date.now(), date: new Date().toISOString().split('T')[0] }); set(KEYS.BROADCASTS, msgs); },
        
        setCurrentUser: (user) => localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user)),
        getCurrentUser: () => JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || 'null'),
        clearSession: () => localStorage.removeItem(KEYS.CURRENT_USER),
        resetData: () => { localStorage.clear(); location.reload(); }
    };
})();