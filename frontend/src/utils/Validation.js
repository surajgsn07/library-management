// Email Validation
export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  // Phone Number Validation (for international format)
  export const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 international format
    return phoneRegex.test(phoneNumber);
  };
  
  // Quantity Validation (non-negative integer)
  export const validateQuantity = (quantity) => {
    const quantityRegex = /^[1-9]\d*$/;  // Must be a non-negative integer and not zero
    return quantityRegex.test(quantity);
  };
  
  // Date Validation (ensures date is not older than today)
  export const validateDateNotOlderThanToday = (date) => {
    const inputDate = new Date(date);
    const today = new Date();
    
    // Reset time for comparison (set to midnight)
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    
    return inputDate <= today; // Date should not be after today
  };
  