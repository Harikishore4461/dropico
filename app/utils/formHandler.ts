

interface FormData {
  bookingType: string;
  fullName: string;
  phoneNumber: string;
  tripType: string;
  pickupLocation: string;
  dropLocation: string;
  date?: string;
  time?: string;
}

interface SheetData {
  'Booking Type': string;
  'Full Name': string;
  'Phone Number': string;
  'Trip Type': string;
  'Pickup Location': string;
  'Drop Location': string;
  'Date': string;
  'Time': string;
  'Created At': string;
}

// API endpoint for form submission
const API_ENDPOINT = '/api/submit-booking';

// Format date for display and storage
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format time for display and storage
export const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  
  try {
    // Handle both 24-hour and 12-hour formats
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

// Get current timestamp
export const getCurrentTimestamp = (): string => {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

// Transform form data to sheet format
export const transformFormDataToSheet = (formData: FormData): SheetData => {
  // For round trips, if drop location is empty, use pickup location
  const dropLocation = formData.tripType === 'round-trip' && !formData.dropLocation.trim() 
    ? formData.pickupLocation 
    : formData.dropLocation;

  return {
    'Booking Type': formData.bookingType === 'now' ? 'Book Now' : 'Schedule Pickup',
    'Full Name': formData.fullName,
    'Phone Number': formData.phoneNumber,
    'Trip Type': formData.tripType,
    'Pickup Location': formData.pickupLocation,
    'Drop Location': dropLocation,
    'Date': formData.date ? formatDate(formData.date) : 'Immediate',
    'Time': formData.time ? formatTime(formData.time) : 'Immediate',
    'Created At': getCurrentTimestamp()
  };
};

// Submit form data to API
export const submitToGoogleSheets = async (formData: FormData): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("HERE")
    const sheetData = transformFormDataToSheet(formData);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: result.success,
      message: result.message || 'Booking submitted successfully! We\'ll contact you soon.'
    };
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      success: false,
      message: 'Failed to submit booking. Please try again or contact us directly.'
    };
  }
};

// Validate form data
export const validateFormData = (formData: FormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!formData.fullName.trim()) {
    errors.push('Full name is required');
  }

  if (!formData.phoneNumber.trim()) {
    errors.push('Phone number is required');
  } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
    errors.push('Please enter a valid phone number');
  }

  if (!formData.pickupLocation.trim()) {
    errors.push('Pickup location is required');
  }

  // For round trips, drop location is not required (same as pickup)
  if (formData.tripType !== 'round-trip' && !formData.dropLocation.trim()) {
    errors.push('Drop location is required');
  }

  if (formData.bookingType === 'schedule') {
    if (!formData.date) {
      errors.push('Date is required for scheduled bookings');
    }
    if (!formData.time) {
      errors.push('Time is required for scheduled bookings');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
