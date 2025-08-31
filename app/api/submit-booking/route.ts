import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['Full Name', 'Phone Number', 'Pickup Location', 'Drop Location'];
    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === '') {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Google Sheets API integration
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!SPREADSHEET_ID) {
      throw new Error('Google Sheets Spreadsheet ID not configured');
    }

    const values = [
      [
        body['Booking Type'],
        body['Full Name'],
        body['Phone Number'],
        body['Trip Type'],
        body['Pickup Location'],
        body['Drop Location'],
        body['Date'],
        body['Time'],
        body['Created At']
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:I',
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    // Log the submission (for development)
    console.log('Booking submission:', body);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Booking submitted successfully! We\'ll contact you soon.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting booking:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit booking. Please try again or contact us directly.' 
      },
      { status: 500 }
    );
  }
}
