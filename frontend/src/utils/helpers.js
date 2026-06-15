// Helper functions

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const getAttendanceStatus = (percentage) => {
  if (percentage >= 90) return { status: 'Excellent', color: '#10B981' };
  if (percentage >= 75) return { status: 'Good', color: '#3B82F6' };
  if (percentage >= 65) return { status: 'Warning', color: '#F59E0B' };
  return { status: 'Critical', color: '#EF4444' };
};

export const calculateRequiredClasses = (present, total, targetPercentage = 75) => {
  const currentPercentage = calculatePercentage(present, total);
  
  if (currentPercentage >= targetPercentage) {
    return 0;
  }
  
  // Calculate required classes to reach target
  const required = Math.ceil((targetPercentage * total - 100 * present) / (100 - targetPercentage));
  return Math.max(0, required);
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

export const getDaysUntil = (date) => {
  const today = new Date();
  const target = new Date(date);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getUrgencyColor = (daysLeft) => {
  if (daysLeft <= 1) return '#EF4444';
  if (daysLeft <= 3) return '#F59E0B';
  if (daysLeft <= 7) return '#3B82F6';
  return '#10B981';
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateColorFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};
