// Minimal Google Apps Script for testing
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'success',
    'message': 'GET request works',
    'timestamp': new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    // Log the request
    console.log('POST request received');
    console.log('Post data:', e.postData.contents);
    
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', data);
    
    const action = data.action;
    console.log('Action:', action);
    
    // Simple response for testing
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'POST request works',
      'action': action,
      'timestamp': new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
} 