// Calculate required classes to reach 75% attendance
export const calculateRequiredClasses = (present, total) => {
  if (total === 0) return 0;
  
  const currentPercentage = (present / total) * 100;
  
  if (currentPercentage >= 75) {
    return 0;
  }
  
  // Formula: (present + x) / (total + x) = 0.75
  // Solving: present + x = 0.75 * (total + x)
  // present + x = 0.75*total + 0.75*x
  // x - 0.75*x = 0.75*total - present
  // 0.25*x = 0.75*total - present
  // x = (0.75*total - present) / 0.25
  
  const required = Math.ceil((0.75 * total - present) / 0.25);
  return required > 0 ? required : 0;
};

// Get attendance intelligence for all subjects
export const getAttendanceIntelligence = async (attendanceRecords) => {
  const intelligence = attendanceRecords.map((record) => {
    const required = calculateRequiredClasses(record.present, record.total);
    const canSkip = calculateCanSkip(record.present, record.total);
    
    let status = 'safe';
    let message = `Your attendance is good at ${record.percentage.toFixed(1)}%`;
    
    if (record.percentage < 75) {
      status = 'critical';
      message = `⚠️ Critical! Attend next ${required} classes to reach 75%`;
    } else if (record.percentage < 80) {
      status = 'warning';
      message = `⚡ Warning! Only ${canSkip} classes can be skipped`;
    } else {
      status = 'safe';
      message = `✅ Safe! You can skip ${canSkip} classes`;
    }

    return {
      subject: record.subject,
      percentage: record.percentage,
      status,
      message,
      required,
      canSkip,
      present: record.present,
      absent: record.absent,
      total: record.total,
    };
  });

  return intelligence;
};

// Calculate how many classes can be skipped while maintaining 75%
const calculateCanSkip = (present, total) => {
  if (total === 0) return 0;
  
  const currentPercentage = (present / total) * 100;
  
  if (currentPercentage < 75) {
    return 0;
  }
  
  // Formula: (present) / (total + x) = 0.75
  // Solving: present = 0.75 * (total + x)
  // present = 0.75*total + 0.75*x
  // present - 0.75*total = 0.75*x
  // x = (present - 0.75*total) / 0.75
  
  const canSkip = Math.floor((present - 0.75 * total) / 0.75);
  return canSkip > 0 ? canSkip : 0;
};

// Get attendance alerts
export const getAttendanceAlerts = (attendanceRecords) => {
  const alerts = [];

  attendanceRecords.forEach((record) => {
    if (record.percentage < 75) {
      const required = calculateRequiredClasses(record.present, record.total);
      alerts.push({
        type: 'critical',
        subject: record.subject,
        message: `Critical: Your ${record.subject} attendance is ${record.percentage.toFixed(1)}%. Attend next ${required} classes!`,
        percentage: record.percentage,
        required,
      });
    } else if (record.percentage < 80) {
      const canSkip = calculateCanSkip(record.present, record.total);
      alerts.push({
        type: 'warning',
        subject: record.subject,
        message: `Warning: ${record.subject} attendance is ${record.percentage.toFixed(1)}%. You can only skip ${canSkip} more classes.`,
        percentage: record.percentage,
        canSkip,
      });
    }
  });

  return alerts;
};

// Predict attendance after N classes
export const predictAttendance = (present, total, futurePresent, futureTotal) => {
  const newPresent = present + futurePresent;
  const newTotal = total + futureTotal;
  
  if (newTotal === 0) return 0;
  
  return (newPresent / newTotal) * 100;
};
