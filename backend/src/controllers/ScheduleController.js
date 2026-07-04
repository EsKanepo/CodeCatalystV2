export class ScheduleController {
  constructor(query) {
    this.query = query;
  }

  getSchedules = async (req, res) => {
    try {
      const sql = `
        SELECT s.*, c.title as course_title, c.level as course_level
        FROM schedules s
        JOIN courses c ON s.course_id = c.id
        WHERE s.is_active = TRUE
        ORDER BY s.start_time ASC
      `;
      const schedules = await this.query(sql);

      // Group schedules by day of week
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      
      const scheduleData = [
        { id: "monday", day: "Senin", icon: "fa-calendar-day", color: "#3b82f6", classes: [] },
        { id: "tuesday", day: "Selasa", icon: "fa-calendar-day", color: "#10b981", classes: [] },
        { id: "wednesday", day: "Rabu", icon: "fa-calendar-day", color: "#f59e0b", classes: [] },
        { id: "thursday", day: "Kamis", icon: "fa-calendar-day", color: "#8b5cf6", classes: [] },
        { id: "friday", day: "Jumat", icon: "fa-calendar-day", color: "#ef4444", classes: [] },
        { id: "saturday", day: "Sabtu", icon: "fa-calendar-day", color: "#6366f1", classes: [] },
        { id: "sunday", day: "Minggu", icon: "fa-calendar-day", color: "#ec4899", classes: [] }
      ];

      schedules.forEach(schedule => {
        const date = new Date(schedule.start_time);
        const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        // Calculate end time
        const endDate = new Date(date.getTime() + schedule.duration_minutes * 60000);
        const endHours = endDate.getHours().toString().padStart(2, '0');
        const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

        const classItem = {
          time: `${hours}.${minutes} - ${endHours}.${endMinutes}`,
          name: schedule.course_title,
          level: schedule.course_level,
          tutor: schedule.instructor,
          tutorId: schedule.instructor.split(' ')[0].toLowerCase(), // generate simple id
          room: "Online", // default room
          duration: `${schedule.duration_minutes / 60} jam`
        };

        // Find the day object and push
        const dayObj = scheduleData.find(d => d.id === days[dayIndex]);
        if (dayObj) {
          dayObj.classes.push(classItem);
        }
      });

      // Filter out days with no classes to keep UI clean, but keep Monday-Friday if empty to show structure
      const activeDays = scheduleData.filter(d => 
        d.classes.length > 0 || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(d.id)
      );

      res.json({
        success: true,
        data: activeDays
      });
    } catch (error) {
      console.error('Get schedules error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch schedules',
        message: 'Internal server error'
      });
    }
  }
}
