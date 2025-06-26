// Simple Google Apps Script for testing
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'success',
    'message': 'Google Sheets API is working',
    'timestamp': new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    console.log('Received action:', action);
    
    switch(action) {
      case 'getUsers':
        return getUsers();
      case 'getConfig':
        return getConfig();
      case 'getNumbers':
        return getNumbers();
      default:
        return ContentService.createTextOutput(JSON.stringify({
          'status': 'error',
          'message': 'Invalid action: ' + action
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getUsers() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const usersSheet = sheet.getSheetByName('Users');
    
    if (!usersSheet) {
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'Sheet "Users" not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = usersSheet.getDataRange().getValues();
    const users = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) {
        users.push({
          name: data[i][0],
          username: data[i][1],
          password: data[i][2],
          isAdmin: data[i][3] === 'TRUE'
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'data': users,
      'count': users.length
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in getUsers:', error);
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': 'Error in getUsers: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getConfig() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const configSheet = sheet.getSheetByName('Config');
    
    if (!configSheet) {
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'Sheet "Config" not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const currentNumber = configSheet.getRange('B1').getValue();
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'data': {
        currentNumber: currentNumber || 100
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in getConfig:', error);
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': 'Error in getConfig: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getNumbers() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const numbersSheet = sheet.getSheetByName('Numbers');
    
    if (!numbersSheet) {
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'Sheet "Numbers" not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = numbersSheet.getDataRange().getValues();
    const numbers = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) {
        numbers.push({
          number: data[i][0],
          content: data[i][1],
          userName: data[i][2],
          timestamp: data[i][3],
          dateTime: data[i][4]
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'data': numbers,
      'count': numbers.length
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in getNumbers:', error);
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': 'Error in getNumbers: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
} 